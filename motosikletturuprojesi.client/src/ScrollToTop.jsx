import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Bu bileþen, sayfa adresi (pathname) her deðiþtiðinde çalýþýr
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Sayfayý en tepeye (0,0 koordinatýna) kaydýr
        window.scrollTo(0, 0);
    }, [pathname]); // 'pathname' deðiþtiðinde bu etkiyi (effect) tetikle

    return null; // Bu bileþen ekranda hiçbir þey göstermez
}