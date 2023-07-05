const checkReservation = async (req, res, next) => {
  //Requestten gelen dataları isimleriyle direkt değişken olarak alıyoruz
  const {
    Tren,
    RezervasyonYapilacakKisiSayisi,
    KisilerFarkliVagonlaraYerlestirilebilir,
  } = req.body;

  let secilebilirVagonlar = []; //Doluluk oranı uygun olanların saklanacağı array
  let YerlesimAyrinti = []; //Response içerisinde gönderilecek array

  // %70 doluluk oranının altındaki vagonları seçilebilir olarak ayrı bir array içerisine alıyoruz.
  Tren.Vagonlar.forEach((vagon) => {
    if (vagon.DoluKoltukAdet / vagon.Kapasite <= 7 / 10)
      secilebilirVagonlar.push(vagon);
  });

  //Doluluk oranı uygun vagon yoksa response'umuzu direkt burada dönüyoruz
  if (!secilebilirVagonlar)
   return res.status(500).json({
      RezervasyonYapilabilir: false,
      YerlesimAyrinti,
    });

  //Burada kişileri farklı vagonlara yerleştirme durumumuzu ve kaç vagona kaçar kişi yerleştireceğimizi tamamen rastgele belirliyoruz
  if (KisilerFarkliVagonlaraYerlestirilebilir) {
    //secilecekVagonSayisi değeri içerisinde rastgele bir vagon sayısı elde ediyoruz ki bu kadar vagona kişilerimizi dağıtalım
    const secilecekVagonSayisi = Math.floor(Math.random() * (secilebilirVagonlar.length + 1 - 1)) + 1;
    //Eğer program tek vagon üzerinden algoritmayı yaparsa direkt bir vagon seçip yolcuları yerleştiriyoruz
    if (secilecekVagonSayisi == 1) {
      return res.status(200).json({
        RezervasyonYapilabilir: true,
        YerlesimAyrinti: {
          VagonAdi:secilebilirVagonlar[Math.floor(Math.random() * secilebilirVagonlar.length)].Ad,
          KisiSayisi: RezervasyonYapilacakKisiSayisi,
        },
      });
    }
    //Eğer birden fazla vagon içerisine yolcuları yerleştirilmeye çalışılırsa kalan vagonları ve kalan yolcu sayısına göre aşağıdaki algoritma çalışıyor
    let kalanKisiSayisi = RezervasyonYapilacakKisiSayisi;

    let kalanVagonlar = secilebilirVagonlar.slice();

    while (kalanKisiSayisi > 0) {
      let secilecekKisiSayisi =
        Math.floor(Math.random() * (kalanKisiSayisi - 1)) + 1;

      //Bazı durumlarda kalan vagonların hepsi bitmesine rağmen yolcuları eşit dağıtamama durumunda elimizde kalan son yolcuları da rastgele bir vagona yerleştiriyoruz aşağıdaki kod parçasında.
      if (kalanVagonlar.length == 0) {
        YerlesimAyrinti[Math.floor(Math.random() * (secilecekVagonSayisi - 1)) + 1].KisiSayisi += secilecekKisiSayisi;
        break;
      }
      //While döngüsü boyunca kalan vagonlar içerisinden rastgele vagonumuzu da(vagon ismini) secilenVagon değişkeninde tutuyoruz.
      let secilenVagon =kalanVagonlar[Math.floor(Math.random() * kalanVagonlar.length)].Ad;

      YerlesimAyrinti.push({
        VagonAdi: secilenVagon,
        KisiSayisi: secilecekKisiSayisi,
      });
      //Buradaki filter işlemi, aynı vagonları birden fazla obje olarak tekrar tekrar yazmamamız için. secilenVagon değeri zaten önceden de seçildiyse bunları tekrar tekrar almıyoruz array'imiz içerisine.
      kalanVagonlar = kalanVagonlar.filter((vagon) => vagon.Ad != secilenVagon);

      kalanKisiSayisi -= secilecekKisiSayisi;
    }
    //Bütün işlemler bittikten sonra istediğiniz formatta response'u kullanıcıya döndürüyoruz
    return res.status(200).json({
      RezervasyonYapilabilir: true,
      YerlesimAyrinti,
    });
  }

  //Burası ise KisilerFarkliVagonlaraYerlestirilebilir değeri false olduğunda çalışan nokta. Yukarıda yaptığımız gibi tek vagon içerisinde gönderiyoruz kullanıcıları
  res.status(200).json({
    RezervasyonYapilabilir: true,
    YerlesimAyrinti: [
      {
        VagonAdi:
          secilebilirVagonlar[Math.floor(Math.random() * secilebilirVagonlar.length)].Ad,
        KisiSayisi: RezervasyonYapilacakKisiSayisi,
      },
    ],
  });
  next();
};

module.exports = { checkReservation };
