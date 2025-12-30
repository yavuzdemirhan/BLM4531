import React from 'react';


function YeniMotorcular() {
    return (
        <>
            <section className="home-yeni" id="anasayfa">
                <div className="content">
                    <h3>MOTOSİKLET DÜNYASINA ATILMAK İSTEYENLER HOŞ GELDİNİZ!</h3>
                    <p>
                        Motosiklet dünyasına adım atmak, bir tutkuya ve özgürlüğe giden heyecan dolu bir
                        yolculuğun başlangıcıdır. Eğer siz de bu serüvene katılmaya kararlı bir şekilde adım atmak istiyorsanız,
                        doğru yerdesiniz! Sitemizin yeni motorcular için ayrılmış köşesinde, başlangıç noktanızı oluşturacak
                        rehberlik ve bilgilerle dolu bir dünya sizi bekliyor.
                    </p>
                    <a href="#teknikozellik" className="buton">ÖĞRENMEYE BAŞLA!</a>
                </div>
            </section>

            <section className="teknik">
                <h1 className="baslik" id="teknikozellik">EKİPMAN VE <span>İLK MOTORSİKLET</span></h1>
                <div className="yazi">
                    <div className="foto">
                        <img src="/resimler/shajan-jacob-ndBDatncNbA-unsplash.jpg" />
                    </div>
                    <div className="content">
                        <h3>DOĞRU EKİPMAN SEÇİMİ!</h3>
                        <p>Motosiklet sürerken doğru ekipmanı kullanmak, sadece bir tercih değil, bir zorunluluktur. Kask, eldiven, mont, pantolon ve bot gibi
                            koruyucu ekipmanlar, sürücünün güvenliği için temel unsurlardır. Bu ekipmanlar, potansiyel kazalarda ciddi yaralanmaları önleyebilir
                            ve sürüş deneyimini daha güvenli hale getirebilir. Unutmayın, güvenlik her zaman öncelikli olmalıdır.
                        </p>
                        <h3>BAŞLANGIÇ MOTORU NASIL OLMALI?</h3>
                        <p>
                            İlk motosikletinizi seçerken dikkate almanız gereken birkaç önemli faktör bulunmaktadır. Başlangıç seviyesinde bir sürücü için hafif,
                            manevra kabiliyeti yüksek ve kullanımı kolay bir motosiklet tercih etmek önemlidir. Bu, sürücünün temel sürüş becerilerini geliştirmesine
                            ve kendini daha rahat hissetmesine yardımcı olur. İlk motosiklet deneyiminiz, sürüş tutkunuzun temellerini atmaya yönelik önemli bir adımdır.
                            Biz Demirhan Motorcycle Club olarak 125cc veya 250cc klasmanında bir motoru öneriyoruz!
                        </p>
                    </div>
                </div>
            </section>

            <section className="teknik">
                <h1 className="baslik" id="teknikozellik">SIKÇA SORULAN <span>SORULAR</span></h1>
                <div className="yazi">
                    <div className="foto">
                        <img src="/resimler/matt-walsh-tVkdGtEe2C4-unsplash.jpg" />
                    </div>
                    <div className="content">
                        <h2>Neden motosiklet sürmeye başlamalıyım?</h2>
                        <h1>Motosiklet sürmek özgürlük hissi verir, trafikte daha çevik olmanızı sağlar ve sürüş deneyimini benzersiz kılar.</h1>
                        <h2> Motosiklet bakımı nasıl yapılır?</h2>
                        <h1>Temel bakım işlemleri, yağ değişimi, lastik kontrolü ve fren bakımını içerir. İlgili talimatları motosikletinizin kullanım kılavuzundan takip etmek önemlidir.</h1>
                        <h2>Motosiklet sürüş lisansı nasıl alınır?</h2>
                        <h1>Motosiklet sürüş lisansı almak için genellikle belirli bir yaş sınırını geçmiş olmanız, sürüş kurslarına katılmanız ve sürüş sınavını geçmeniz gereklidir.</h1>
                        <h2>Trafik kurallarına nasıl uyum sağlarım?</h2>
                        <h1>Motosiklet sürerken trafik kurallarına uymak, güvenliğiniz ve diğer sürücülerle uyum içinde olmanız açısından önemlidir. Hız sınırlarına dikkat edin ve daima işaretlere uyun.</h1>
                        <h2>Hangi hava koşullarında sürüş yapmalıyım?</h2>
                        <h1>Güvenli sürüş için ideal olan hava koşullarında sürüş yapmalısınız. Yağmurlu, karlı veya buzlu hava koşullarında dikkatli olmalı ve gerektiğinde sürüşü ertelemelisiniz.</h1>
                    </div>
                </div>
            </section>
        </>
    );
}

export default YeniMotorcular;