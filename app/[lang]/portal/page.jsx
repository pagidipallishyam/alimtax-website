"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  addDoc,
  where,
  updateDoc,
  onSnapshot, // ✅ realtime
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { auth, db, storage } from "../../../lib/firebase";

export default function CustomerPortalPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang === "ru" ? "ru" : "en";

  const [tab, setTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState("customer");

  // Profile
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileMsg, setProfileMsg] = useState("");

  // Upload
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadMsg, setUploadMsg] = useState("");

  // Documents list
  const [docsLoading, setDocsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  // Support (send)
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSending, setSupportSending] = useState(false);

  // Support (list + replies) ✅ no-index version
  const [supportTickets, setSupportTickets] = useState([]);
  const [supportTicketsLoading, setSupportTicketsLoading] = useState(false);

  const t = useMemo(() => {
    const en = {
      brand: "ALIM TAX",
      titleCustomer: "Customer Portal",
      titleAdmin: "Admin Portal",
      backHome: "Back to Home",
      logout: "Logout",
      goAdmin: "Go to Admin",

      dashboard: "Dashboard",
      profile: "Profile",
      upload: "Upload Documents",
      support: "Support",

      welcome: "Welcome",
      bullets: [
        "View your profile information",
        "Upload tax documents securely",
        "We will contact you after review",
      ],
      bulletsAdmin: [
        "You are logged in as Admin",
        "You can review customer uploads",
        "You can manage status here",
      ],

      profileTitle: "Your Profile",
      phone: "Phone Number",
      address: "Address",
      save: "Save Profile",
      saved: "Profile saved successfully.",

      uploadTitle: "Upload Tax Documents",
      uploadBtn: "Upload",
      uploading: "Uploading...",
      uploadOk: "Uploaded successfully.",
      uploadFail: "Upload failed. Please try again.",

      docsTitle: "Your Uploaded Documents",
      noDocs: "No documents uploaded yet.",
      status: "Status",
      filename: "File Name",
      uploaded: "Uploaded",
      pending: "Pending Review",
      reviewed: "Reviewed",
      approved: "Approved",

      supportTitle: "Contact Support",
      supportSub: "Send a message to ALIM TAX team.",
      subject: "Subject",
      message: "Message",
      send: "Send Message",
      sent: "Message sent. We will respond soon.",
      required: "Please fill subject and message.",

      myTickets: "My Tickets",
      noTickets: "No tickets yet.",
      adminReply: "Admin Reply",
      noReply: "No reply yet.",
      open: "open",
      closed: "closed",
    };

    const ru = {
      brand: "ALIM TAX",
      titleCustomer: "Портал клиента",
      titleAdmin: "Админ-портал",
      backHome: "На главную",
      logout: "Выйти",
      goAdmin: "Админ",

      dashboard: "Панель",
      profile: "Профиль",
      upload: "Загрузить документы",
      support: "Поддержка",

      welcome: "Добро пожаловать",
      bullets: [
        "Просмотрите информацию профиля",
        "Безопасно загружайте налоговые документы",
        "Мы свяжемся с вами после проверки",
      ],
      bulletsAdmin: [
        "Вы вошли как администратор",
        "Вы можете просматривать загрузки клиентов",
        "Вы можете менять статус",
      ],

      profileTitle: "Ваш профиль",
      phone: "Номер телефона",
      address: "Адрес",
      save: "Сохранить",
      saved: "Профиль успешно сохранён.",

      uploadTitle: "Загрузка налоговых документов",
      uploadBtn: "Загрузить",
      uploading: "Загрузка...",
      uploadOk: "Файл успешно загружен.",
      uploadFail: "Ошибка загрузки. Попробуйте еще раз.",

      docsTitle: "Ваши загруженные документы",
      noDocs: "Документы еще не загружены.",
      status: "Статус",
      filename: "Имя файла",
      uploaded: "Загружено",
      pending: "Ожидает проверки",
      reviewed: "Проверено",
      approved: "Одобрено",

      supportTitle: "Связаться с поддержкой",
      supportSub: "Отправьте сообщение команде ALIM TAX.",
      subject: "Тема",
      message: "Сообщение",
      send: "Отправить",
      sent: "Сообщение отправлено. Мы скоро ответим.",
      required: "Заполните тему и сообщение.",

      myTickets: "Мои запросы",
      noTickets: "Пока нет запросов.",
      adminReply: "Ответ администратора",
      noReply: "Пока нет ответа.",
      open: "open",
      closed: "closed",
    };

    return lang === "ru" ? ru : en;
  }, [lang]);

  useEffect(() => {
    let unsubTickets = null;

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      try {
        if (!u) {
          router.replace(`/${lang}/login`);
          return;
        }
        if (!u.emailVerified) {
          router.replace(`/${lang}/verify-email`);
          return;
        }

        setUser(u);

        const r = await loadProfileAndRole(u.uid, u.email);
        await loadDocuments(u.uid, r);

        // ✅ Realtime tickets (NO INDEX): where(uid==) only, then JS sort
        setSupportTicketsLoading(true);
        const qTickets = query(
          collection(db, "support_tickets"),
          where("uid", "==", u.uid)
        );

        unsubTickets = onSnapshot(
          qTickets,
          (snap) => {
            const list = [];
            snap.forEach((d) => list.push({ id: d.id, ...d.data() }));

            list.sort((a, b) => {
              const ams =
                a?.createdAt?.toMillis?.() ??
                a?.createdAt?.seconds * 1000 ??
                0;
              const bms =
                b?.createdAt?.toMillis?.() ??
                b?.createdAt?.seconds * 1000 ??
                0;
              return bms - ams;
            });

            setSupportTickets(list);
            setSupportTicketsLoading(false);
          },
          (err) => {
            console.error("SUPPORT SNAPSHOT ERROR:", err);
            setSupportTicketsLoading(false);
          }
        );

        setLoading(false);
      } catch (e) {
        console.error("PORTAL INIT ERROR:", e);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubTickets) unsubTickets();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const goHome = () => router.push(`/${lang}`);
  const goAdmin = () => router.push(`/${lang}/admin`);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace(`/${lang}/login`);
  };

  const displayName =
    user?.displayName || (user?.email ? user.email.split("@")[0] : "User");

  async function loadProfileAndRole(uid, email) {
    setProfileMsg("");

    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data();
      setPhone(data?.phone || "");
      setAddress(data?.address || "");

      const r = (data?.role || "customer").toLowerCase();
      setRole(r === "admin" ? "admin" : "customer");
      return r;
    } else {
      await setDoc(
        userDocRef,
        {
          uid,
          email: email || "",
          createdAt: serverTimestamp(),
          phone: "",
          address: "",
          role: "customer",
        },
        { merge: true }
      );
      setRole("customer");
      return "customer";
    }
  }

  async function saveProfile() {
    if (!user?.uid) return;
    setProfileMsg("");

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email || "",
        phone,
        address,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setProfileMsg(t.saved);
    setTimeout(() => setProfileMsg(""), 2500);
  }

  async function loadDocuments(uid, roleValue = "customer") {
    setDocsLoading(true);
    try {
      const isAdminRole = (roleValue || "").toLowerCase() === "admin";

      const qDocs = isAdminRole
        ? query(collection(db, "documents"), orderBy("createdAt", "desc"))
        : query(
            collection(db, "documents"),
            where("uid", "==", uid),
            orderBy("createdAt", "desc")
          );

      const snap = await getDocs(qDocs);
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setDocuments(list);
    } finally {
      setDocsLoading(false);
    }
  }

  function statusLabel(s) {
    if (s === "reviewed") return t.reviewed;
    if (s === "approved") return t.approved;
    return t.pending;
  }

  async function downloadDoc(storagePath) {
    try {
      const url = await getDownloadURL(ref(storage, storagePath));
      window.open(url, "_blank");
    } catch (e) {
      console.error("DOWNLOAD ERROR:", e);
      alert("Unable to download file. Check Storage rules.");
    }
  }

  async function adminSetStatus(docId, newStatus) {
    try {
      await updateDoc(doc(db, "documents", docId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      await loadDocuments(user.uid, role);
    } catch (e) {
      console.error("STATUS UPDATE ERROR:", e);
      alert("Unable to update status. Check Firestore rules.");
    }
  }

  async function uploadSelectedFile() {
    if (!user?.uid) return;

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setUploadMsg("Please select a file first.");
      return;
    }

    setUploadMsg("");
    setUploading(true);
    setProgress(0);

    try {
      const safeName = file.name.replace(/[^\w.\-() ]+/g, "_");
      const path = `user_uploads/${user.uid}/${Date.now()}_${safeName}`;
      const storageRef = ref(storage, path);

      const task = uploadBytesResumable(storageRef, file);

      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setProgress(pct);
        },
        (err) => {
          console.error("UPLOAD ERROR:", err);
          setUploadMsg(err?.message || t.uploadFail);
          setUploading(false);
          setProgress(0);
        },
        async () => {
          await addDoc(collection(db, "documents"), {
            uid: user.uid,
            email: user.email || "",
            fileName: file.name,
            storagePath: path,
            status: "pending",
            createdAt: serverTimestamp(),
          });

          setUploadMsg(t.uploadOk);
          setUploading(false);
          setProgress(100);

          if (fileRef.current) fileRef.current.value = "";

          await loadDocuments(user.uid, role);

          setTimeout(() => setUploadMsg(""), 2500);
          setTimeout(() => setProgress(0), 1500);
        }
      );
    } catch (e) {
      console.error(e);
      setUploadMsg(t.uploadFail);
      setUploading(false);
      setProgress(0);
    }
  }

  async function sendSupport() {
    setSupportMsg("");
    const sub = supportSubject.trim();
    const msg = supportMessage.trim();

    if (!sub || !msg) {
      setSupportMsg(t.required);
      return;
    }

    setSupportSending(true);
    try {
      await addDoc(collection(db, "support_tickets"), {
        uid: user.uid,
        email: user.email || "",
        subject: sub,
        message: msg,
        status: "open",
        createdAt: serverTimestamp(),
      });

      setSupportSubject("");
      setSupportMessage("");
      setSupportMsg(t.sent);
      setTimeout(() => setSupportMsg(""), 3000);
    } catch (e) {
      console.error("SUPPORT ERROR:", e);
      setSupportMsg("Unable to send. Check Firestore rules.");
    } finally {
      setSupportSending(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>Loading...</div>
        </div>
      </div>
    );
  }

  const isAdmin = role === "admin";

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Brand header */}
        <div style={styles.brandRow}>
          <div style={styles.brandLeft}>
            <img
              src="/alim-logo.png"
              alt="ALIM TAX"
              style={styles.logo}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div>
              <div style={styles.brandName}>{t.brand}</div>
              <div style={styles.brandSub}>
                {isAdmin ? t.titleAdmin : t.titleCustomer}
              </div>
            </div>
          </div>

          <div style={styles.topActions}>
            {isAdmin && (
              <button onClick={goAdmin} style={styles.btnPrimary}>
                {t.goAdmin}
              </button>
            )}
            <button onClick={goHome} style={styles.btnGhost}>
              {t.backHome}
            </button>
            <button onClick={handleLogout} style={styles.btnDanger}>
              {t.logout}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button onClick={() => setTab("dashboard")} style={tabBtn(tab === "dashboard")}>
            {t.dashboard}
          </button>
          <button onClick={() => setTab("profile")} style={tabBtn(tab === "profile")}>
            {t.profile}
          </button>
          <button onClick={() => setTab("upload")} style={tabBtn(tab === "upload")}>
            {t.upload}
          </button>
          <button onClick={() => setTab("support")} style={tabBtn(tab === "support")}>
            {t.support}
          </button>
        </div>

        <div style={styles.card}>
          {tab === "dashboard" && (
            <>
              <h2 style={styles.h2}>✅ {t.dashboard}</h2>
              <p style={styles.p}>
                {t.welcome}, <b>{displayName}</b>{" "}
                {isAdmin && <span style={{ opacity: 0.7 }}>(Admin)</span>}
              </p>
              <ul style={styles.ul}>
                {(isAdmin ? t.bulletsAdmin : t.bullets).map((b, i) => (
                  <li key={i} style={styles.li}>
                    {b}
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "profile" && (
            <>
              <h2 style={styles.h2}>👤 {t.profileTitle}</h2>

              <div style={styles.grid}>
                <div style={styles.field}>
                  <div style={styles.label}>Email</div>
                  <div style={styles.value}>{user?.email}</div>
                </div>

                <div style={styles.field}>
                  <div style={styles.label}>{t.phone}</div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (xxx) xxx-xxxx"
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.label}>{t.address}</div>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, City, State ZIP"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={saveProfile} style={styles.btnPrimary}>
                  {t.save}
                </button>
                {profileMsg && <span style={styles.msgOk}>{profileMsg}</span>}
              </div>
            </>
          )}

          {tab === "upload" && (
            <>
              <h2 style={styles.h2}>📤 {t.uploadTitle}</h2>

              <div style={styles.uploadBox}>
                <input ref={fileRef} type="file" style={styles.file} />
                <button
                  onClick={uploadSelectedFile}
                  style={styles.btnPrimary}
                  disabled={uploading}
                >
                  {uploading ? t.uploading : t.uploadBtn}
                </button>
              </div>

              {uploading && (
                <div style={styles.progressWrap}>
                  <div style={styles.progressBarOuter}>
                    <div style={{ ...styles.progressBarInner, width: `${progress}%` }} />
                  </div>
                  <div style={styles.progressText}>{progress}%</div>
                </div>
              )}

              {uploadMsg && (
                <div style={uploadMsg === t.uploadOk ? styles.msgOk : styles.msgErr}>
                  {uploadMsg}
                </div>
              )}

              <div style={{ marginTop: 18 }}>
                <h3 style={styles.h3}>{t.docsTitle}</h3>

                {docsLoading ? (
                  <div>Loading documents...</div>
                ) : documents.length === 0 ? (
                  <div style={{ opacity: 0.8 }}>{t.noDocs}</div>
                ) : (
                  <div style={styles.tableWrap}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          {isAdmin && <th style={styles.th}>Customer Email</th>}
                          <th style={styles.th}>{t.filename}</th>
                          <th style={styles.th}>{t.status}</th>
                          <th style={styles.th}>{t.uploaded}</th>
                          <th style={styles.th}>Download</th>
                          {isAdmin && <th style={styles.th}>Update Status</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((d) => (
                          <tr key={d.id}>
                            {isAdmin && <td style={styles.td}>{d.email || "-"}</td>}
                            <td style={styles.td}>{d.fileName}</td>
                            <td style={styles.td}>
                              <span style={badgeStyle(d.status)}>{statusLabel(d.status)}</span>
                            </td>
                            <td style={styles.td}>
                              {d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString() : "-"}
                            </td>
                            <td style={styles.td}>
                              <button style={styles.btnGhost} onClick={() => downloadDoc(d.storagePath)}>
                                Download
                              </button>
                            </td>
                            {isAdmin && (
                              <td style={styles.td}>
                                <select
                                  value={d.status || "pending"}
                                  onChange={(e) => adminSetStatus(d.id, e.target.value)}
                                  style={styles.input}
                                >
                                  <option value="pending">pending</option>
                                  <option value="reviewed">reviewed</option>
                                  <option value="approved">approved</option>
                                </select>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "support" && (
            <>
              <h2 style={styles.h2}>💬 {t.supportTitle}</h2>
              <p style={{ marginTop: 6, opacity: 0.8 }}>{t.supportSub}</p>

              {/* Send form */}
              <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                <div>
                  <div style={styles.label}>{t.subject}</div>
                  <input
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    style={styles.input}
                    placeholder={t.subject}
                  />
                </div>

                <div>
                  <div style={styles.label}>{t.message}</div>
                  <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    style={{ ...styles.input, minHeight: 120, resize: "vertical" }}
                    placeholder={t.message}
                  />
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    onClick={sendSupport}
                    style={styles.btnPrimary}
                    disabled={supportSending}
                  >
                    {supportSending ? "..." : t.send}
                  </button>
                  {supportMsg && (
                    <span style={supportMsg === t.sent ? styles.msgOk : styles.msgErr}>
                      {supportMsg}
                    </span>
                  )}
                </div>
              </div>

              {/* Tickets list + admin replies (realtime) */}
              <div style={{ marginTop: 22 }}>
                <h3 style={styles.h3}>{t.myTickets}</h3>

                {supportTicketsLoading ? (
                  <div>Loading tickets...</div>
                ) : supportTickets.length === 0 ? (
                  <div style={{ opacity: 0.75 }}>{t.noTickets}</div>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {supportTickets.map((tk) => (
                      <div
                        key={tk.id}
                        style={{
                          border: "1px solid #e7ecf3",
                          borderRadius: 14,
                          padding: 14,
                          background: "#fff",
                        }}
                      >
                        <div style={{ fontWeight: 900 }}>{tk.subject || "-"}</div>

                        <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                          {tk.message || "-"}
                        </div>

                        <div style={{ marginTop: 10, opacity: 0.75, fontWeight: 800 }}>
                          Status: {tk.status || t.open} •{" "}
                          {tk.createdAt?.toDate ? tk.createdAt.toDate().toLocaleString() : "-"}
                        </div>

                        <div
                          style={{
                            marginTop: 12,
                            padding: 12,
                            borderRadius: 12,
                            background: "#eef6ff",
                            border: "1px solid #cfe3ff",
                          }}
                        >
                          <div style={{ fontWeight: 900, marginBottom: 6 }}>
                            {t.adminReply}
                          </div>
                          {tk.adminReply ? (
                            <div style={{ whiteSpace: "pre-wrap" }}>{tk.adminReply}</div>
                          ) : (
                            <div style={{ opacity: 0.7 }}>{t.noReply}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const tabBtn = (active) => ({
  ...styles.tabBtn,
  border: active ? "2px solid #0e2a38" : "1px solid #e7ecf3",
  background: active ? "#fff" : "#f6f8fc",
});

const badgeStyle = (status) => {
  let border = "#e7ecf3";
  let bg = "#f6f8fc";
  let color = "#0b1220";
  if (status === "approved") {
    border = "#0e2a38";
    bg = "#eef6ff";
  } else if (status === "reviewed") {
    border = "#6a768a";
    bg = "#f2f4f7";
  } else {
    border = "#d62828";
    bg = "#fff5f5";
    color = "#b71e1e";
  }
  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${border}`,
    background: bg,
    color,
    fontWeight: 800,
    fontSize: 12,
  };
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f7f9fc, #ffffff)",
    padding: "28px 0",
    fontFamily: 'ui-serif, Georgia, "Times New Roman", Times, serif',
    color: "#0b1220",
  },
  container: { width: "min(1100px, 92%)", margin: "0 auto" },

  brandRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 14,
  },
  brandLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: {
    height: 44,
    width: 44,
    borderRadius: 12,
    border: "1px solid #e7ecf3",
    background: "#fff",
    objectFit: "cover",
  },
  brandName: { fontWeight: 900, fontSize: 18, letterSpacing: 0.4 },
  brandSub: { opacity: 0.7, fontWeight: 800 },

  topActions: { display: "flex", gap: 10, alignItems: "center" },

  tabs: { display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" },
  tabBtn: {
    padding: "10px 16px",
    borderRadius: 999,
    cursor: "pointer",
    fontWeight: 700,
  },
  card: {
    background: "#fff",
    border: "1px solid #e7ecf3",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 18px 45px rgba(16,24,40,.08)",
  },
  h2: { margin: "0 0 10px", fontSize: 22 },
  h3: { margin: "16px 0 10px", fontSize: 18 },
  p: { margin: "10px 0" },
  ul: { margin: "10px 0 0 18px" },
  li: { margin: "6px 0" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12,
    marginTop: 12,
  },
  field: {
    border: "1px solid #e7ecf3",
    borderRadius: 14,
    padding: 14,
    background: "#f9fbff",
  },
  label: { fontSize: 12, opacity: 0.7, marginBottom: 6, fontWeight: 700 },
  value: { fontSize: 14, fontWeight: 700, overflow: "hidden" },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e7ecf3",
    outline: "none",
    fontWeight: 700,
    background: "#fff",
  },

  uploadBox: { display: "flex", gap: 10, alignItems: "center", marginTop: 12 },
  file: { flex: 1 },

  progressWrap: { marginTop: 12, display: "flex", alignItems: "center", gap: 10 },
  progressBarOuter: {
    flex: 1,
    height: 12,
    borderRadius: 999,
    background: "#eef2f7",
    overflow: "hidden",
    border: "1px solid #e7ecf3",
  },
  progressBarInner: {
    height: "100%",
    borderRadius: 999,
    background: "#0e2a38",
  },
  progressText: { fontWeight: 800, minWidth: 44, textAlign: "right" },

  msgOk: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid #0e2a38",
    background: "#eef6ff",
    fontWeight: 800,
  },
  msgErr: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid #d62828",
    background: "#fff5f5",
    color: "#b71e1e",
    fontWeight: 800,
  },

  btnGhost: {
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid #e7ecf3",
    background: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  btnDanger: {
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid #b71e1e",
    background: "#d62828",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #0e2a38",
    background: "#0e2a38",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },

  tableWrap: {
    border: "1px solid #e7ecf3",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 10,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "12px 12px",
    fontSize: 12,
    letterSpacing: 0.2,
    background: "#f6f8fc",
    borderBottom: "1px solid #e7ecf3",
  },
  td: {
    padding: "12px 12px",
    borderBottom: "1px solid #eef2f7",
    fontWeight: 700,
    fontSize: 13,
    verticalAlign: "top",
  },
};