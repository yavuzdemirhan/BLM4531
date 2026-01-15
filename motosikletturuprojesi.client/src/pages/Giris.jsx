import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Giris() {
    const navigate = useNavigate();

    // Form verilerini tutan state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Hata mesajını ekranda göstermek için
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Her denemede önceki hatayı temizle

        try {
            const response = await fetch('/api/account/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Başarılıysa Backend'den gelen veriyi (Token ve Username) al
                const data = await response.json();

                // --- BİLGİLERİ TARAYICIYA KAYDETME ---
                // localStorage yerine sessionStorage 
                sessionStorage.setItem('token', data.token);

                
                sessionStorage.setItem('username', data.username);

                // Formdan gelen e-posta
                sessionStorage.setItem('userEmail', formData.email);

                sessionStorage.setItem('role', data.role);

                
                navigate('/');

            } else {
                // --- HATA DURUMU ---
                
                setMessage("Giriş başarısız. E-posta veya şifre hatalı.");
            }
        } catch (error) {
            console.error("Hata:", error);
            setMessage("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
        }
    };

    return (
        <section className="auth-section">
            <h1 className="baslik">GİRİŞ <span>YAP</span></h1>

            <div className="form-kutu">
                <form onSubmit={handleSubmit}>

                    {/* HATA MESAJI ALANI */}
                    {message && (
                        <p style={{
                            color: '#e74c3c',
                            backgroundColor: '#fdedec',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #e74c3c',
                            textAlign: 'center',
                            marginBottom: '15px'
                        }}>
                            {message}
                        </p>
                    )}

                    <div className="input-grup">
                        <label htmlFor="email">E-posta Adresiniz</label>
                        <input
                            type="email" id="email" name="email" required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-grup">
                        <label htmlFor="password">Şifreniz</label>
                        <input
                            type="password" id="password" name="password" required
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="buton" style={{ width: '100%', textAlign: 'center' }}>
                        Giriş Yap
                    </button>
                </form>

                <p className="auth-yonlendirme">
                    Hesabın yok mu? <Link to="/kayit">Hemen Kayıt Ol</Link>
                </p>
            </div>
        </section>
    );
}

export default Giris;