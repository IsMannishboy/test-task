
import { useEffect } from "react";
import GetDealsImagesAndRenderDeals from "../components/Main/funcs"
 function Main(){
    var deals = []
    useEffect(() => {
    async function getDeals() {
        try {
            const res = await fetch("/deals", { method: "GET" });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

        deals = await res.json(); 
            console.log(deals)
            

            GetDealsImagesAndRenderDeals(deals); 
        } catch (error) {
            console.error("get deals error:", error);
        }
    }

    getDeals();
}, []);
    return (
        <div className="page">
            <h1 id="head">Open deals</h1>
            <div id="deals">

            </div>
        </div>
    )
}
export default Main