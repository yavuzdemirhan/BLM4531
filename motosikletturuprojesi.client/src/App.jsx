import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

import HomePage from './pages/HomePage';
import Giris from './pages/Giris';
import Kayit from './pages/Kayit';
import YeniMotorcular from './pages/YeniMotorcular';
import Ipuclari from './pages/Ipuclari';
import Iletisim from './pages/Iletisim';
import Profil from './pages/Profil';
import TurDetay from './pages/TurDetay';
import Etkinliklerim from './pages/Etkinliklerim';
import TurEkle from './pages/TurEkle';
import AdminPanel from './pages/AdminPanel';

function App() {
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState(null);

    // 1. YENİ: Rol bilgisini tutacak state
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const username = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role'); // 2. YENİ: Rolü session'dan oku

        if (username) {
            setCurrentUser(username);
            setUserRole(role); // State'e kaydet
        } else {
            setCurrentUser(null);
            setUserRole(null);
        }
    }, [location]);

    return (
        <>
            <ScrollToTop />

            <header className="header">
                <a href="#" className="logo">
                    <img src="/resimler/Retro Motorcycle Community Club Badge Logo.png" alt="logo" />
                </a>
                <nav className="navbar">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)}>ANA SAYFA</Link>
                    <Link to="/#bestbikes">TURLAR</Link>

                    {currentUser && <Link to="/etkinliklerim">ETKİNLİKLERİM</Link>}

                    {/* --- 3. YENİ: SADECE ADMIN GÖRSÜN --- */}
                    {userRole === 'Admin' && (
                        <Link to="/admin" style={{ color: 'red', fontWeight: 'bold', border: '1px solid red', padding: '5px 10px', borderRadius: '5px' }}>
                            ADMİN PANELİ 🛡️
                        </Link>
                    )}

                    <Link to="/yeni" onClick={() => window.scrollTo(0, 0)}>YENİ MOTORCULAR</Link>
                    <Link to="/ipuclari" onClick={() => window.scrollTo(0, 0)}>SÜRÜŞ İPUÇLARI</Link>
                    <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>İLETİŞİM</Link>
                </nav>

                <div className="aboutandcontact">
                    {currentUser ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {/* Kullanıcı Adı BEYAZ */}
                            <span className="auth-link" style={{
                                color: '#fff',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}>
                                {currentUser}
                            </span>
                            {/* Profil Butonu */}
                            <Link to="/profil" className="auth-link" style={{
                                border: '2px solid #fff',
                                color: '#fff',
                                padding: '5px 15px',
                                borderRadius: '5px'
                            }}>
                                PROFİLİM
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link to="/kayit" className="auth-link">Kayıt Ol</Link>
                            <Link to="/giris" className="auth-link">Giriş Yap</Link>
                        </>
                    )}
                    <input type="image" src="/resimler/menu.png" width="20px" id="responsive-buton" />
                </div>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/giris" element={<Giris />} />
                    <Route path="/kayit" element={<Kayit />} />
                    <Route path="/yeni" element={<YeniMotorcular />} />
                    <Route path="/ipuclari" element={<Ipuclari />} />
                    <Route path="/contact" element={<Iletisim />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/tur-detay/:id" element={<TurDetay />} />
                    <Route path="/etkinliklerim" element={<Etkinliklerim />} />
                    <Route path="/tur-ekle" element={<TurEkle />} />
                    <Route path="/admin" element={<AdminPanel />} />
                </Routes>
            </main>

            <footer className="footer">
                <h3>SOSYAL MEDYA HESAPLARIMIZ</h3>
                <p>Daha fazlası için bizi takipte kalın!</p>
                <div className="sosyal">
                    <div className="facebook"><a href="https://facebook.com"><img src="/resimler/facebook.png" /></a></div>
                    <div className="twitter"><a href="https://twitter.com"><img src="/resimler/twitter.png" /></a></div>
                    <div className="google"><a href="https://google.com"><img src="/resimler/social.png" /></a></div>
                    <div className="instagram"><a href="https://instagram.com"><img src="/resimler/instagram.png" /></a></div>
                    <div className="youtube"><a href="https://youtube.com"><img src="/resimler/youtube.png" /></a></div>
                </div>
                <p className="sonyazi">Demirhan Motorcycle Club 2003 yılında kurulmuş bağımsız bir kulüptür.</p>
            </footer>
        </>
    );
}

export default App;