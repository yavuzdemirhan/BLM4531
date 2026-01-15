import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style_detay.css';

function TurDetay() {
    const { id } = useParams();
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');

    const [tour, setTour] = useState(null);
    const [stops, setStops] = useState([]);
    const [comments, setComments] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Takip Durumu State'i
    const [isFollowing, setIsFollowing] = useState(false);

    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);

    // Durak Ekleme Form State'leri
    const [showStopForm, setShowStopForm] = useState(false);
    const [stopFormData, setStopFormData] = useState({
        stopName: '',
        description: '',
        time: ''
    });

    useEffect(() => {
        if (!username) {
            navigate('/giris');
            return;
        }
        fetchAllData();
    }, [id]);

    const fetchAllData = async () => {
        try {
            // 1. Tur Detayını Çek
            const tourRes = await fetch(`/api/Tours`);
            const allTours = await tourRes.json();
            const foundTour = allTours.find(t => t.id == id);
            setTour(foundTour);

            if (foundTour) {
                // 2. Durakları Çek
                const stopsRes = await fetch(`/api/RouteStops/${id}`);
                if (stopsRes.ok) setStops(await stopsRes.json());

                // 3. Yorumları Çek
                const commentsRes = await fetch(`/api/Comments/${id}`);
                if (commentsRes.ok) setComments(await commentsRes.json());

                // 4. Katılım Durumunu Kontrol Et
                const joinRes = await fetch(`/api/Participations/check?tourId=${id}&username=${username}`);
                if (joinRes.ok) {
                    const joinData = await joinRes.json();
                    setIsJoined(joinData.isJoined);
                }

                // 5. Favori Durumunu Kontrol Et
                const favRes = await fetch(`/api/Favorites/${username}`);
                if (favRes.ok) {
                    const favList = await favRes.json();
                    setIsFavorite(favList.some(f => f.tourId == id));
                }

                // 6. TAKİP DURUMUNU KONTROL ET (Yeni Backend Endpoint ile)
                // Kaptan kendimiz değilsek kontrol ediyoruz
                if (foundTour.olusturanKisi !== username) {
                    checkFollowStatus(foundTour.olusturanKisi);
                }
            }
        } catch (error) {
            console.error("Veri hatası", error);
        } finally {
            setLoading(false);
        }
    };

    // --- TAKİP KONTROL FONKSİYONU ---
    const checkFollowStatus = async (kaptanAdi) => {
        try {
            // Backend'e eklediğin yeni endpoint: /api/Follows/check
            const res = await fetch(`/api/Follows/check?follower=${username}&followed=${kaptanAdi}`);

            if (res.ok) {
                const data = await res.json();
                // Backend { isFollowing: true/false } dönüyor varsayıyoruz
                setIsFollowing(data.isFollowing);
            }
        } catch (err) {
            console.error("Takip kontrol hatası:", err);
        }
    };

    const isCaptain = tour && tour.olusturanKisi === username;

    const getImageUrl = (t) => {
        if (!t) return "";
        if (t.customImageUrl && t.customImageUrl.trim() !== "") return t.customImageUrl;

        const cat = t.motosikletKategorisi ? t.motosikletKategorisi.toLowerCase() : "";
        if (cat.includes('enduro') || cat.includes('cross')) return "https://images.unsplash.com/photo-1558980664-2506fca6bfc2?q=80&w=1000&auto=format&fit=crop";
        if (cat.includes('chopper') || cat.includes('cruiser')) return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop";
        if (cat.includes('racing')) return "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop";
        return "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000&auto=format&fit=crop";
    };

    // --- TAKİP ET / BIRAK (TOGGLE) ---
    const handleFollowToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!tour) return;

        // Anında görüntü değişimi (Optimistic Update)
        const previousState = isFollowing;
        setIsFollowing(!isFollowing);

        try {
            // POST /api/Follows/toggle
            const res = await fetch('/api/Follows/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    FollowerUsername: username,
                    FollowingUsername: tour.olusturanKisi
                })
            });

            if (!res.ok) {
                setIsFollowing(previousState);
                alert("İşlem başarısız.");
            }
        } catch (error) {
            console.error(error);
            setIsFollowing(previousState);
        }
    };

    const handleAddStop = async (e) => {
        e.preventDefault();
        if (!stopFormData.stopName) return alert("Durak adı boş olamaz!");

        const newStop = {
            tourId: id,
            stopName: stopFormData.stopName,
            description: stopFormData.description,
            time: stopFormData.time,
            orderIndex: stops.length + 1
        };

        try {
            const res = await fetch('/api/RouteStops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStop)
            });

            if (res.ok) {
                alert("Durak eklendi!");
                setStopFormData({ stopName: '', description: '', time: '' });
                setShowStopForm(false);
                // Durakları güncelle
                const stopsRes = await fetch(`/api/RouteStops/${id}`);
                if (stopsRes.ok) setStops(await stopsRes.json());
            } else {
                alert("Hata oluştu.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleJoinToggle = async () => {
        if (isJoined) {
            const res = await fetch(`/api/Participations/leave?tourId=${id}&username=${username}`, { method: 'DELETE' });
            if (res.ok) { setIsJoined(false); alert("Turdan ayrıldınız."); }
        } else {
            const res = await fetch('/api/Participations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ TourId: id, Username: username, TourTitle: tour.baslik })
            });
            if (res.ok) { setIsJoined(true); alert("Tura katıldınız!"); }
        }
    };

    const handleFavoriteToggle = async () => {
        const res = await fetch('/api/Favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ TourId: id, Username: username, TourTitle: tour.baslik, TourImage: getImageUrl(tour) })
        });
        if (res.ok) setIsFavorite(!isFavorite);
    };

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!commentText) return;

        try {
            const res = await fetch('/api/Comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ TourId: id, Username: username, Content: commentText })
            });

            if (res.ok) {
                // BAŞARILI DURUMU
                setCommentText("");
                alert("✅ Yorumunuz alındı! Admin onayından sonra yayınlanacaktır.");
            } else {
                // HATA DURUMU (Backend 'BadRequest' döndürdüyse)
                // Backend'den gelen "Bu tura sadece 1 yorum yapabilirsiniz" yazısını okuyoruz
                const errorText = await res.text();

                // Ve kullanıcıya uyarı olarak gösteriyoruz
                alert("⚠️ " + errorText); // Çıktı: "⚠️ Bu tura sadece 1 yorum yapabilirsiniz."
            }
        } catch (error) {
            console.error("Yorum gönderme hatası:", error);
            alert("Sunucuyla bağlantı kurulamadı.");
        }
    };

    const handleRating = async (score) => {
        if (!confirm(`${score} puan vermek istediğine emin misin?`)) return;
        await fetch('/api/Ratings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ TourId: id, Username: username, Score: score })
        });
        alert("Puanınız kaydedildi!");
        fetchAllData();
    };

    // --- TUR SİLME ---
    const handleDeleteTour = async () => {
        if (!confirm("DİKKAT! Bu turu ve tüm verilerini (duraklar, yorumlar vb.) silmek üzeresin. Devam edilsin mi?")) return;

        try {
            const res = await fetch(`/api/Tours/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Tur başarıyla silindi.");
                navigate('/etkinliklerim');
            } else {
                alert("Silme işlemi başarısız.");
            }
        } catch (error) {
            console.error(error);
            alert("Sunucu hatası.");
        }
    };

    if (loading) return <div style={{ padding: '100px', color: 'white', textAlign: 'center', fontSize: '24px' }}>Tur bilgileri yükleniyor...</div>;

    if (!tour) return <div style={{ padding: '100px', color: 'red', textAlign: 'center', fontSize: '24px' }}>Tur bulunamadı veya silinmiş.</div>;

    return (
        <div className="detay-container">
            {/* Header Resim */}
            <div className="detay-header">
                <img src={getImageUrl(tour)} alt={tour.baslik} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000&auto=format&fit=crop" }} />

                <div className="detay-overlay">
                    <div>
                        <h1 style={{ fontSize: '40px', fontWeight: '900' }}>{tour.baslik}</h1>
                        <span style={{ fontSize: '20px', color: 'orange' }}>
                            {tour.motosikletKategorisi === 'Gezi' ? 'TOURING' : (tour.motosikletKategorisi ? tour.motosikletKategorisi.toUpperCase() : "")}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '30px', fontWeight: 'bold' }}>
                            ★ {tour.averageRating ? tour.averageRating.toFixed(1) : "0.0"}
                        </div>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} onClick={() => handleRating(s)} style={{ cursor: 'pointer', fontSize: '20px', color: 'gold' }}>★</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bilgi Kartı */}
            <div className="detay-bilgi-kutusu">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
                    <div><h3 style={{ color: 'grey' }}>ROTA</h3><h2>{tour.rota}</h2></div>
                    <div><h3 style={{ color: 'grey' }}>TARİH</h3><h2>{new Date(tour.tarih).toLocaleDateString('tr-TR')}</h2></div>

                    {/* KAPTAN VE TAKİP ET */}
                    <div>
                        <h3 style={{ color: 'grey' }}>KAPTAN</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h2>{tour.olusturanKisi}</h2>

                            {!isCaptain && (
                                <button
                                    onClick={handleFollowToggle}
                                    className={isFollowing ? "btn-unfollow-mini" : "btn-follow-mini"}
                                    type="button"
                                >
                                    {isFollowing ? '✓ Takipte' : '+ Takip Et'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />
                <h3 style={{ color: 'grey', marginBottom: '10px' }}>AÇIKLAMA</h3>
                <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{tour.aciklama}</p>

                <div className="aksiyon-butonlari">
                    <button className="btn-fav" onClick={handleFavoriteToggle}>
                        {isFavorite ? '❤️ Favorilerde' : '🤍 Favoriye Ekle'}
                    </button>

                    {/* KAPTAN AKSİYONLARI */}
                    {isCaptain ? (
                        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                            <button className="btn-kaptan" disabled>
                                KAPTANSINIZ 👑
                            </button>
                            <button className="btn-sil" onClick={handleDeleteTour}>
                                SİL 🗑️
                            </button>
                        </div>
                    ) : (
                        <button
                            className={`btn-katil ${isJoined ? 'btn-katildi' : ''}`}
                            onClick={handleJoinToggle}
                        >
                            {isJoined ? 'KATILDINIZ (İPTAL ET)' : 'TURA KATIL'}
                        </button>
                    )}
                </div>
            </div>

            {/* Rota Planı */}
            <div className="detay-bilgi-kutusu">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid grey', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>DETAYLI ROTA PLANI</h2>
                    {isCaptain && (
                        <button onClick={() => setShowStopForm(!showStopForm)} className="btn-durak-ekle">
                            {showStopForm ? 'İptal' : '+ Durak Ekle'}
                        </button>
                    )}
                </div>

                {showStopForm && (
                    <div className="stop-form-container">
                        <form onSubmit={handleAddStop}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input type="text" placeholder="Durak Adı" className="stop-input" value={stopFormData.stopName} onChange={(e) => setStopFormData({ ...stopFormData, stopName: e.target.value })} required />
                                <input type="text" placeholder="Saat" className="stop-input" style={{ flex: '0 0 100px' }} value={stopFormData.time} onChange={(e) => setStopFormData({ ...stopFormData, time: e.target.value })} />
                            </div>
                            <input type="text" placeholder="Açıklama" className="stop-input" style={{ marginBottom: '10px' }} value={stopFormData.description} onChange={(e) => setStopFormData({ ...stopFormData, description: e.target.value })} />
                            <button type="submit" className="buton" style={{ marginTop: 0, width: '100%', backgroundColor: 'orange', color: 'black' }}>KAYDET</button>
                        </form>
                    </div>
                )}

                {stops.length === 0 ? <p style={{ color: 'grey' }}>Durak bilgisi girilmemiş.</p> : (
                    stops.map((stop, index) => (
                        <div key={index} className="timeline-item">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className="timeline-dot"></div>
                                {index !== stops.length - 1 && <div className="timeline-line"></div>}
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{stop.stopName}</h3>
                                <span style={{ color: 'orange', fontSize: '14px' }}>{stop.time}</span>
                                <p style={{ color: 'grey', margin: '5px 0' }}>{stop.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Yorumlar */}
            <div className="detay-bilgi-kutusu">
                <h2 style={{ marginBottom: '20px' }}>YORUMLAR ({comments.length})</h2>
                {comments.map((c, i) => (
                    <div key={i} className="yorum-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong style={{ color: 'white' }}>{c.username}</strong>
                            <small style={{ color: 'grey' }}>{new Date(c.createdAt).toLocaleDateString()}</small>
                        </div>
                        <p style={{ marginTop: '5px', color: '#ccc' }}>{c.content}</p>
                    </div>
                ))}
                <form onSubmit={handleSendComment} style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Yorum yap..." value={commentText} onChange={(e) => setCommentText(e.target.value)} style={{ flex: 1, padding: '15px', borderRadius: '10px', backgroundColor: 'black', color: 'white', border: '1px solid #333' }} />
                    <button type="submit" className="buton" style={{ marginTop: 0 }}>GÖNDER</button>
                </form>
            </div>
        </div>
    );
}

export default TurDetay;