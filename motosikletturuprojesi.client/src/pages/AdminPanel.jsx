import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const navigate = useNavigate();
    const [pendingComments, setPendingComments] = useState([]);

    // Login olurken kaydettiğimiz rol bilgisi
    const role = sessionStorage.getItem('role');

    useEffect(() => {
        // Eğer giren kişi Admin değilse, ana sayfaya postala!
        if (role !== 'Admin') {
            navigate('/');
            return;
        }
        fetchPendingComments();
    }, []);

    // Onay bekleyenleri çek
    const fetchPendingComments = async () => {
        try {
            const res = await fetch('/api/Comments/pending');
            if (res.ok) {
                setPendingComments(await res.json());
            }
        } catch (err) {
            console.error("Veri çekme hatası:", err);
        }
    };

    // Yorumu ONAYLA
    const handleApprove = async (id) => {
        if (!confirm("Bu yorumu yayınlamak istiyor musun?")) return;

        try {
            const res = await fetch(`/api/Comments/approve/${id}`, { method: 'POST' });
            if (res.ok) {
                alert("Yorum yayına alındı! ✅");
                // Listeden bu yorumu çıkar (Sayfayı yenilemeye gerek kalmasın)
                setPendingComments(pendingComments.filter(c => c.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Yorumu SİL (REDDET)
    const handleDelete = async (id) => {
        if (!confirm("Bu yorumu kalıcı olarak silmek istiyor musun?")) return;

        try {
            const res = await fetch(`/api/Comments/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Yorum reddedildi ve silindi. 🗑️");
                setPendingComments(pendingComments.filter(c => c.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ paddingTop: '140px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="baslik">ADMİN <span>PANELİ</span></h1>

            <div className="kutu-container" style={{ maxWidth: '900px', width: '95%' }}>
                <h2 style={{ borderBottom: '1px solid grey', paddingBottom: '10px', marginBottom: '20px', color: 'orange' }}>
                    ONAY BEKLEYEN YORUMLAR ({pendingComments.length})
                </h2>

                {pendingComments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: 'grey', fontSize: '18px' }}>
                        🎉 Süper! Onay bekleyen yeni yorum yok.
                    </div>
                ) : (
                    pendingComments.map(comment => (
                        <div key={comment.id} style={{
                            backgroundColor: '#1a1a1a',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '15px',
                            border: '1px solid #333',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                                <strong style={{ color: 'orange', fontSize: '18px' }}>{comment.username}</strong>
                                <small style={{ color: 'grey' }}>{new Date(comment.createdAt).toLocaleString()}</small>
                            </div>

                            <p style={{ color: '#ddd', fontSize: '16px', fontStyle: 'italic', padding: '10px 0' }}>
                                "{comment.content}"
                            </p>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <button
                                    onClick={() => handleApprove(comment.id)}
                                    className="buton"
                                    style={{ backgroundColor: 'green', color: 'white', flex: 1, marginTop: 0 }}>
                                    ✅ ONAYLA VE YAYINLA
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="buton"
                                    style={{ backgroundColor: 'darkred', color: 'white', flex: 1, marginTop: 0 }}>
                                    ❌ REDDET VE SİL
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminPanel;