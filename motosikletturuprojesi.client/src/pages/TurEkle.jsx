import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style_detay.css';

function TurEkle() {
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');

    // --- TUR BİLGİLERİ STATE'İ ---
    const [formData, setFormData] = useState({
        baslik: '',
        rota: '',
        tarih: '',
        motosikletKategorisi: 'Touring',
        aciklama: '',
        customImageUrl: ''
    });

    // --- DURAKLAR STATE'İ  ---
    const [stops, setStops] = useState([]); // Eklenecek durakların listesi
    const [stopForm, setStopForm] = useState({
        stopName: '',
        time: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!username) navigate('/giris');
    }, [username, navigate]);

    // Input Değişiklikleri
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Durak Form Değişiklikleri
    const handleStopChange = (e) => {
        setStopForm({ ...stopForm, [e.target.name]: e.target.value });
    };

    // --- YERELE DURAK EKLEME ---
    const addStopLocal = (e) => {
        e.preventDefault();
        if (!stopForm.stopName) return alert("Durak adı zorunludur!");

        const newStop = {
            ...stopForm,
            id: Date.now(), 
            orderIndex: stops.length + 1
        };

        setStops([...stops, newStop]); // Listeye ekle
        setStopForm({ stopName: '', time: '', description: '' }); 
    };

    // --- YERELDEN DURAK SİLME ---
    const removeStopLocal = (id) => {
        setStops(stops.filter(s => s.id !== id));
    };

    // --- YAYINLAMA İŞLEMİ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const tourData = {
            ...formData,
            olusturanKisi: username,
            viewCount: 0,
            averageRating: 0
        };

        try {
            // 1. ÖNCE TURU OLUŞTUR
            const tourRes = await fetch('/api/Tours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tourData)
            });

            if (tourRes.ok) {
                const createdTour = await tourRes.json();
                const newTourId = createdTour.id; 

                // 2. VARSA DURAKLARI KAYDET
                if (stops.length > 0) {
                   
                    const stopRequests = stops.map((stop, index) => {
                        return fetch('/api/RouteStops', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                tourId: newTourId, 
                                stopName: stop.stopName,
                                description: stop.description,
                                time: stop.time,
                                orderIndex: index + 1
                            })
                        });
                    });

                   
                    await Promise.all(stopRequests);
                }

                alert("Tur ve rota planı başarıyla oluşturuldu! İyi sürüşler kaptan.");
                navigate('/etkinliklerim');
            } else {
                alert("Tur oluşturulamadı.");
            }
        } catch (error) {
            console.error("Hata:", error);
            alert("Sunucu hatası.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-section">
            <h1 className="baslik">YENİ TUR <span>OLUŞTUR</span></h1>

            <div className="form-kutu" style={{ maxWidth: '900px' }}>
                {/* --- ANA FORM --- */}
                <form onSubmit={(e) => e.preventDefault()}>

                    {/* Başlık */}
                    <div className="input-grup">
                        <label>Tur Başlığı</label>
                        <input type="text" name="baslik" required value={formData.baslik} onChange={handleChange} placeholder="Örn: Büyük Ege Turu" />
                    </div>

                    {/* Rota ve Tarih */}
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div className="input-grup" style={{ flex: 1 }}>
                            <label>Rota</label>
                            <input type="text" name="rota" required value={formData.rota} onChange={handleChange} placeholder="Örn: İstanbul - İzmir" />
                        </div>
                        <div className="input-grup" style={{ flex: 1 }}>
                            <label>Tarih & Saat</label>
                            <input type="datetime-local" name="tarih" required value={formData.tarih} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Kategori */}
                    <div className="input-grup">
                        <label>Kategori</label>
                        <select name="motosikletKategorisi" value={formData.motosikletKategorisi} onChange={handleChange} className="control-input" style={{ width: '100%', border: '1px solid #ccc' }}>
                            <option value="Touring">Touring</option>
                            <option value="Enduro">Enduro</option>
                            <option value="Chopper">Chopper</option>
                            <option value="Racing">Racing</option>
                        </select>
                    </div>

                    {/* Resim URL */}
                    <div className="input-grup">
                        <label>Kapak Resmi (Opsiyonel)</label>
                        <input type="text" name="customImageUrl" value={formData.customImageUrl} onChange={handleChange} placeholder="https://..." />
                    </div>

                    {/* Açıklama */}
                    <div className="input-grup">
                        <label>Detaylı Açıklama</label>
                        <textarea
                            name="aciklama" required value={formData.aciklama} onChange={handleChange} rows="4"
                            style={{ fontFamily: 'sans-serif', padding: '15px', border: '1px solid #ccc', borderRadius: '10px', width: '100%', resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <hr style={{ margin: '30px 0', border: '1px solid #eee' }} />

                    {/* --- DURAK EKLEME ALANI --- */}
                    <div className="durak-ekleme-bolumu" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '15px' }}>
                        <h3 style={{ color: 'black', marginBottom: '15px' }}>ROTA PLANLAYICI (DURAKLAR)</h3>

                        {/* Durak Formu */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div style={{ flex: 2 }}>
                                <input type="text" name="stopName" value={stopForm.stopName} onChange={handleStopChange} placeholder="Durak Adı (Örn: Mola Yeri)" style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <input type="text" name="time" value={stopForm.time} onChange={handleStopChange} placeholder="Saat (10:30)" style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ flex: 2 }}>
                                <input type="text" name="description" value={stopForm.description} onChange={handleStopChange} placeholder="Açıklama" style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }} />
                            </div>
                            <button onClick={addStopLocal} className="buton" style={{ marginTop: 0, padding: '10px 20px', fontSize: '16px', backgroundColor: 'orange', color: 'black' }}>+ EKLE</button>
                        </div>

                        {/* Eklenen Duraklar Listesi */}
                        <div style={{ marginTop: '20px' }}>
                            {stops.length === 0 ? (
                                <p style={{ color: 'grey', fontStyle: 'italic' }}>Henüz durak eklenmedi.</p>
                            ) : (
                                stops.map((stop, index) => (
                                    <div key={stop.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                        <div style={{ backgroundColor: 'black', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {index + 1}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ color: 'black', fontSize: '18px' }}>{stop.stopName}</strong>
                                            <span style={{ color: 'orange', marginLeft: '10px', fontWeight: 'bold' }}>{stop.time}</span>
                                            <p style={{ margin: 0, color: 'grey', fontSize: '14px' }}>{stop.description}</p>
                                        </div>
                                        <button onClick={() => removeStopLocal(stop.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>❌</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* KAYDET BUTONU */}
                    <button
                        onClick={handleSubmit}
                        className="buton"
                        disabled={loading}
                        style={{ width: '100%', backgroundColor: loading ? 'grey' : 'black', marginTop: '30px', fontSize: '22px' }}
                    >
                        {loading ? 'TUR OLUŞTURULUYOR...' : 'TURU VE ROTAYI YAYINLA 🚀'}
                    </button>

                </form>
            </div>
        </section>
    );
}

export default TurEkle;