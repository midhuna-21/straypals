import { useEffect, useState } from 'react'
  import { auth } from '../lib/firebase'
  import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
  import { doc, setDoc, serverTimestamp } from "firebase/firestore";
  import { db } from "../lib/firebase";

  type Props = { open: boolean, onClose: () => void }

  export default function AuthModal({ open, onClose }: Props) {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [busy, setBusy] = useState(false)
    const [err, setErr] = useState('')

    if (!open) return null

    async function submit(e: any) {
      e.preventDefault();
      setErr('');
      setBusy(true);

      try {
        if (mode === 'signup') {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          if (name) await updateProfile(cred.user, { displayName: name });

          await setDoc(doc(db, 'users', cred.user.uid), {
            uid: cred.user.uid,
            name: name,
            email: email,
            password: password,
            createdAt: serverTimestamp(),
          });
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }

        onClose();
      } catch (e: any) {
        setErr(e?.message || 'Authentication failed');
      } finally {
        setBusy(false);
      }
    }

    useEffect(() => {
  if (open) {
    // disable scroll
    document.body.style.overflow = 'hidden';
  } else {
    // enable scroll
    document.body.style.overflow = '';
  }

  // cleanup when modal unmounts
  return () => {
    document.body.style.overflow = '';
  };
}, [open]);

    return (
      <>
        <style>{`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .auth-input {
            width: 100%;
            padding: 12px 16px;
            font-size: 15px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            outline: none;
            transition: all 0.2s;
            font-family: inherit;
            background: white;
            box-sizing: border-box;
          }

          .auth-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          .auth-input::placeholder {
            color: #94a3b8;
          }

          .btn-primary {
            width: 100%;
            padding: 14px;
            font-size: 15px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            background: #0b1117;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 12px;
            font-family: inherit;
          }

          .btn-primary:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }

          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .btn-secondary {
            width: 100%;
            padding: 14px;
            font-size: 15px;
            font-weight: 500;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            background: white;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
          }

          .btn-secondary:hover {
            border-color: #cbd5e1;
            background: #f8fafc;
          }

          .link-text {
            color: #667eea;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: color 0.2s;
          }

          .link-text:hover {
            color: #764ba2;
            text-decoration: underline;
          }

          .close-btn {
            position: absolute;
            top: 24px;
            right: 24px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            background: #f1f5f9;
            color: #64748b;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            font-size: 20px;
          }

          .close-btn:hover {
            background: #e2e8f0;
            color: #334155;
            transform: rotate(90deg);
          }
        `}</style>

        <div
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={onClose}
        >
          <div
            style={{
              width: '480px',
              maxWidth: '100vw',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              animation: 'slideInRight 0.4s ease-out',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.3)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              background: 'white',
              minHeight: '100vh',
              padding: '60px 40px',
              position: 'relative'
            }}>
              {/* Decorative blobs */}
              <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: '#667eea',
                top: '-100px',
                right: '-100px',
                filter: 'blur(60px)',
                opacity: 0.15,
                pointerEvents: 'none'
              }}></div>
    

              <button className="close-btn" onClick={onClose}>×</button>



              <h2 style={{
                marginTop: 0,
                marginBottom: 8,
                fontSize: 28,
                fontWeight: 700,
                textAlign: 'center',
                color: '#0f172a',
                letterSpacing: '-0.02em'
              }}>
                {mode === 'signup' ? 'Create your account' : 'Back to help?'}
              </h2>

              <p style={{
                marginTop: 0,
                marginBottom: 40,
                fontSize: 15,
                color: '#64748b',
                textAlign: 'center'
              }}>
                {mode === 'signup' ? 'Sign up to get started with us' : 'Continue spreading kindness'}
              </p>

              <form onSubmit={submit}>
                {mode === 'signup' && (
                  <div style={{ marginBottom: 20 }}>
                    <label style={{
                      display: 'block',
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#334155'
                    }}>
                      Full Name
                    </label>
                    <input
                      className="auth-input"
                      placeholder=""
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                )}

                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#334155'
                  }}>
                    Email Address
                  </label>
                  <input
                    className="auth-input"
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#334155'
                  }}>
                    Password
                  </label>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                {err && (
                  <div style={{
                    padding: '12px 16px',
                    marginBottom: 20,
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    color: '#dc2626',
                    fontSize: 14,
                    borderRadius: 8,
                    borderLeft: '4px solid #dc2626',
                    animation: 'fadeIn 0.3s ease-out'
                  }}>
                    {err}
                  </div>
                )}

                <button
                  className="btn-primary"
                  type="submit"
                  disabled={busy}
                >
                  {busy ? 'Please wait…' : (mode === 'signup' ? 'Create account' : 'Sign in')}
                </button>

                <button
                  className="btn-secondary"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </form>

              <div style={{
                marginTop: 32,
                // paddingTop: 32,
                // borderTop: '2px solid #f1f5f9',
                textAlign: 'center',
                fontSize: 14,
                color: '#64748b'
              }}>
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <span
                  className="link-text"
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                >
                  {mode === 'signup' ? 'Sign in' : 'Sign up'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }