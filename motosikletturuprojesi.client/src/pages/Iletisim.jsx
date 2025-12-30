import React from 'react';

function Iletisim() {
    return (
        <>
            <section className="home-contact" id="anasayfa">
                <div className="content">
                    <h3>DEMİRHAN MOTORCYCLE CLUB'A ULAŞ</h3>
                    <p>
                        Eğer bize soruların varsa veya kulübe üye olmak
                        istiyorsan aşağıdaki<br />kısımdan bize ulaşabilirsin!
                        Ayrıca sayfanın sonuna kaydırırsan sosyal medya<br />hesaplarımızı
                        orada bulabilirsin ve son gelişmeleri takip edebilirsin!
                    </p>
                    <a href="#contact1" className="buton">BİZE ULAŞ!</a>
                </div>
            </section>

            <section className="contact">
                <h1 className="baslik" id="contact1">BİZE <span>ULAŞ</span></h1>
                <div className="harita">
                    <iframe
                        className="konum"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12264.480160432155!2d32.8199154!3d39.7818614!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d3423274e2f30b%3A0x47bfec2be9776ed5!2zQW5rYXJhIMOcbml2ZXJzaXRlc2kgQmlsZ2lzYXlhciBNw7xoZW5kaXNsacSfaSBCw7Zsw7xtw7w!5e0!3m2!1str!2str!4v1703547689933!5m2!1str!2str"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps Konum"
                    ></iframe>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <h3>BİZE ULAŞMAK İÇİN DOLDUR</h3>
                        <div className="inputlar">
                            <img src="/resimler/user.png" />
                            <input type="text" placeholder="İSİM" />
                        </div>
                        <div className="inputlar">
                            <img src="/resimler/mail.png" />
                            <input type="text" placeholder="E-MAİL" />
                        </div>
                        <div className="inputlar">
                            <img src="/resimler/telephone.png" />
                            <input type="text" placeholder="TELEFON" />
                        </div>
                        <input type="submit" className="buton" value="      GÖNDER      " />
                    </form>
                </div>
            </section>
        </>
    );
}

export default Iletisim;