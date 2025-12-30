import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- STATE'LER ---
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Hepsi");
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const response = await fetch('/api/Tours');
            if (response.ok) {
                const data = await response.json();
                setTours(data);
            }
        } catch (error) {
            console.error("Turlar çekilemedi", error);
        } finally {
            setLoading(false);
        }
    };

    // --- FİLTRELEME MANTIĞI  ---
    const filteredTours = tours.filter(tour => {
        const matchesSearch = tour.baslik.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesCategory = false;
        if (selectedCategory === "Hepsi") {
            matchesCategory = true;
        }
        else if (selectedCategory === "Touring") {
            matchesCategory = tour.motosikletKategorisi === "Touring" || tour.motosikletKategorisi === "Gezi";
        }
        else {
            matchesCategory = tour.motosikletKategorisi === selectedCategory;
        }

        return matchesSearch && matchesCategory;
    });

    // --- RESİM SEÇİCİ ---
    const getImageUrl = (tour) => {
        if (tour.customImageUrl) return tour.customImageUrl;

        const category = tour.motosikletKategorisi ? tour.motosikletKategorisi.toLowerCase() : "";

        // 1. ENDURO / CROSS
        if (category.includes('enduro') || category.includes('cross')) {
            return "https://images.unsplash.com/photo-1558980664-2506fca6bfc2?q=80&w=1000&auto=format&fit=crop";
        }
        // 2. CHOPPER / CRUISER
        if (category.includes('chopper') || category.includes('cruiser')) {
            return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop";
        }
        // 3. RACING / SUPERSPORT
        if (category.includes('racing') || category.includes('supersport')) {
            return "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop";
        }

        // 4. TOURING 
        return "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000&auto=format&fit=crop";
    };

    return (
        <>
            <section className="home" id="anasayfa">
                <div className="content">
                    <h3>ÖZGÜRLÜĞE HOŞ GELDİNİZ!</h3>
                    <p>
                        Motosikletler özgürlüğün kaynağıdır ve
                        sen de bu özgürlüğün parçası olmak istiyorsan<br />
                        Demirhan Motorcycle Club ailesine katılarak sitemizi keşfetmeye başlayabilirsin!
                    </p>
                    <a href="#bestbikes" className="buton">TURLARI KEŞFET!</a>
                </div>
            </section>

            <section className="bestbikes">
                <h1 className="baslik" id="bestbikes">GÜNCEL <span>TURLAR</span></h1>

                <div className="tours-wrapper">

                    {/* --- KONTROL PANELİ --- */}
                    <div className="tour-controls">
                        <select
                            className="control-input"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="Hepsi">Tüm Kategoriler</option>
                            <option value="Touring">Touring</option>
                            <option value="Enduro">Enduro</option>
                            <option value="Chopper">Chopper</option>
                            <option value="Racing">Racing</option>
                        </select>

                        {/* Arama Çubuğu */}
                        <input
                            type="text"
                            className="control-input search-bar"
                            placeholder="Tur ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {/* Tur Ekle Butonu */}
                        <div className="add-btn-wrapper">
                            {username ? (
                                <Link to="/tur-ekle" className="buton" style={{ marginTop: 0, backgroundColor: 'yellow', color: 'black' }}>
                                    + TUR EKLE
                                </Link>
                            ) : (
                                <div style={{ width: '120px' }}></div>
                            )}
                        </div>
                    </div>

                    {/* --- LİSTE --- */}
                    {loading ? (
                        <div style={{ color: 'white', textAlign: 'center', fontSize: '24px', padding: '50px' }}>Yükleniyor...</div>
                    ) : (
                        <div className="kutu-container">
                            {filteredTours.length > 0 ? filteredTours.map((tour) => (
                                <div className="tour-card" key={tour.id}>

                                    {/* ÜST KISIM (Resim, Kategori, Rating) */}
                                    <div className="card-image-wrapper">
                                        <img src={getImageUrl(tour)} alt={tour.baslik} />

                                        <span className="card-category">
                                            {tour.motosikletKategorisi === 'Gezi' ? 'TOURING' : tour.motosikletKategorisi.toUpperCase()}
                                        </span>

                                        <div className="card-rating">
                                            <span style={{ color: 'orange' }}>★</span> {tour.averageRating.toFixed(1)}
                                        </div>
                                    </div>

                                    {/* ALT KISIM */}
                                    <div className="card-content">
                                        {/* Başlık */}
                                        <h3 className="card-title">{tour.baslik}</h3>

                                        {/* Rota */}
                                        <div className="card-info-row">
                                            <span className="info-icon">📍</span>
                                            <span className="info-text">{tour.rota}</span>
                                        </div>

                                        {/* Açıklama */}
                                        <p className="card-desc">
                                            {tour.aciklama}
                                        </p>

                                        {/* Tarih */}
                                        <div className="card-info-row">
                                            <span className="info-icon">📅</span>
                                            <span className="info-text">
                                                {new Date(tour.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>

                                        {/* Kaptan */}
                                        <div className="card-info-row">
                                            <span className="info-icon">👤</span>
                                            <span className="info-text kaptan-text">{tour.olusturanKisi}</span>
                                        </div>

                                        <Link to={`/tur-detay/${tour.id}`} className="card-button">
                                            İNCELE
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'white', fontSize: '20px', padding: '50px' }}>
                                    Aradığınız kriterlere uygun tur bulunamadı.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default HomePage;