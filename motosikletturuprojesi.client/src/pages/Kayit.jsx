import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Kayit() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [errorList, setErrorList] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorList([]);
        setSuccessMessage('');

        try {
            const response = await fetch('/api/account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (err) {
                data = {};
            }

            if (response.ok) {
                // --- BAŞARILI ---
                setSuccessMessage("Kayıt Başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
                setFormData({ username: '', email: '', password: '' });
                setTimeout(() => {
                    navigate('/giris');
                }, 2000);

            } else {
                // --- HATA YAKALAMA ---
                let errors = [];

                // Senaryo A: Standart .NET Identity hatası { errors: { "Password": ["..."] } }
                if (data.errors) {
                    errors = Object.values(data.errors).flat();
                }
                // Senaryo B: Dizi olarak gelen hatalar [{ code: "...", description: "..." }]
                else if (Array.isArray(data)) {
                    errors = data.map(e => e.description || e.message || "Bir hata oluştu.");
                }
                // Senaryo C: Tekil mesaj { message: "..." }
                else if (data.message) {
                    errors.push(data.message);
                }
                // Senaryo D: Identity Error Dizisi (Code, Description)
                else if (typeof data === 'object') {
                    Object.keys(data).forEach(key => {
                        if (key !== 'title' && key !== 'status' && key !== 'traceId') {
                            if (Array.isArray(data[key])) {
                                errors.push(...data[key]);
                            } else {
                                errors.push(data[key]);
                            }
                        }
                    });
                }

                if (errors.length === 0) {
                    if (response.status === 400) errors.push("Geçersiz veri gönderildi.");
                    else if (response.status === 500) errors.push("Sunucu hatası oluştu.");
                    else errors.push("Bilinmeyen bir hata oluştu.");
                }

                setErrorList(errors);
            }
        } catch (error) {
            console.error("Hata:", error);
            setErrorList(["Sunucuya bağlanılamadı."]);
        }
    };

    return (
        <section className="auth-section">
            <h1 className="baslik">KAYIT <span>OL</span></h1>

            <div className="form-kutu">
                <form onSubmit={handleSubmit}>

                    {/* --- HATA MESAJLARI  */}
                    {errorList.length > 0 && (
                        <div style={{
                            color: '#e74c3c',
                            backgroundColor: '#fdedec',
                            padding: '15px',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            border: '1px solid #e74c3c',
                            textAlign: 'left',
                            fontSize: '0.9rem'
                        }}>
                            <strong style={{ display: 'block', marginBottom: '5px' }}>Lütfen şunları düzeltin:</strong>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                {errorList.map((err, index) => (
                                    <li key={index}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* --- BAŞARI MESAJI KUTUSU --- */}
                    {successMessage && (
                        <div style={{
                            color: '#2ecc71',
                            backgroundColor: '#eafaf1',
                            padding: '15px',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            textAlign: 'center',
                            border: '1px solid #2ecc71'
                        }}>
                            {successMessage}
                        </div>
                    )}

                    <div className="input-grup">
                        <label htmlFor="username">Kullanıcı Adınız</label>
                        <input
                            type="text" id="username" name="username" required
                            value={formData.username} onChange={handleChange}
                        />
                    </div>

                    <div className="input-grup">
                        <label htmlFor="email">E-posta Adresiniz</label>
                        <input
                            type="email" id="email" name="email" required
                            value={formData.email} onChange={handleChange}
                        />
                    </div>

                    <div className="input-grup">
                        <label htmlFor="password">Şifreniz</label>
                        <input
                            type="password" id="password" name="password" required
                            value={formData.password} onChange={handleChange}
                            placeholder="En az 8 karakter, büyük harf, sayı..."
                        />
                    </div>

                    <button type="submit" className="buton" style={{ width: '100%', textAlign: 'center' }}>
                        Kayıt Ol
                    </button>
                </form>

                <p className="auth-yonlendirme">
                    Zaten bir hesabın var mı? <Link to="/giris">Hemen Giriş Yap</Link>
                </p>
            </div>
        </section>
    );
}

export default Kayit;