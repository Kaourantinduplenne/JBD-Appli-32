import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../firebase';

const rigs = ['DAT', 'DCQ', 'DGD', 'DPN', 'DPS', 'DPT', 'DTH', 'DTN', 'DVS'];
const rigIcons = Object.fromEntries(rigs.map(r => [r, `/icons/${r}.png`]));
const jbdTypes = ['Formal JBD', 'On-site/On-day JBD'];
const jbdIcons = {
  'Formal JBD': '/icons/Formal_JBD.png',
  'On-site/On-day JBD': '/icons/Rig_JBD.png'
};
const departments = ['Drilling', 'Deck', 'Marine', 'Subsea', 'Maintenance'];

const renderIcons = (items, onClick, iconMap) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {items.map((item) => (
        <div
          key={item}
          style={{ backgroundColor: '#eee', textAlign: 'center', padding: 10 }}
          onClick={() => onClick(item)}
        >
          {iconMap[item] && <img src={iconMap[item]} alt={item} width={64} height={64} />}
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [path, setPath] = useState([]);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [upload, setUpload] = useState({ rig: '', dept: '', file: null });
  const [message, setMessage] = useState('');

  const goBack = () => {
    if (selectedPdfUrl) setSelectedPdfUrl(null);
    else setPath(path.slice(0, -1));
  };

  const handleUpload = async () => {
    if (!upload.rig || !upload.dept || !upload.file) return alert('All fields are required');
    const fileRef = ref(storage, `${upload.rig}/${upload.dept}/${upload.file.name}`);
    await uploadBytes(fileRef, upload.file);
    setMessage('PDF uploaded successfully');
  };

  const renderPage = () => {
    if (path.length === 0) {
      return (
        <>
          {renderIcons(rigs, (r) => setPath([r]), rigIcons)}
          <div style={{ marginTop: 20 }}>
            {!adminLoggedIn ? (
              <div style={{ marginTop: 10 }}>
                <input
                  type="password"
                  placeholder="Admin Password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
                <button onClick={() => {
                  if (adminPass === 'admin123') setAdminLoggedIn(true);
                  else alert('Wrong password');
                }}>Login</button>
              </div>
            ) : (
              <button onClick={() => {
                setAdminLoggedIn(false);
                setAdminPass('');
              }}>Logout</button>
            )}
          </div>
        </>
      );
    } else if (path.length === 1) {
      return renderIcons(jbdTypes, (j) => setPath([...path, j]), jbdIcons);
    } else if (path.length === 2) {
      return renderIcons(departments, (d) => setPath([...path, d]), {});
    } else if (path.length === 3) {
      const dummyURL = `https://firebasestorage.googleapis.com/v0/b/jbd-app-01.appspot.com/o/sample.pdf?alt=media`;
      return (
        <div>
          <p>Example PDF Placeholder</p>
          <button onClick={() => setSelectedPdfUrl(dummyURL)}>Open Example PDF</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>JBD App</h1>
      <>
      {(path.length > 0 || selectedPdfUrl) && (
        <button onClick={goBack} style={{ marginBottom: 20 }}>Back</button>
      )}
      {renderPage()}
    </>

      {adminLoggedIn && (
        <div style={{ marginTop: 30 }}>
          <h3>Upload PDF (Formal JBD only)</h3>
          <select onChange={e => setUpload({ ...upload, rig: e.target.value })}>
            <option value="">Select Rig</option>
            {rigs.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select onChange={e => setUpload({ ...upload, dept: e.target.value })}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input type="file" onChange={e => setUpload({ ...upload, file: e.target.files[0] })} />
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}