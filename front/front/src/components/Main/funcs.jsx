 import "../../assets/Main/main.css"
 function Removegaps(deal){
        let res = '';
            for(let i = 0;i < deal.length;i++){
                if(deal[i] !== ' '){
                    res += deal[i]
                }
            }
            return res
    }   
     async function GetDealsImagesAndRenderDeals(deals){
        let dealsdiv = document.getElementById("deals")
        for (let i = 0;i < deals.length;i++) {
            let urldealname = Removegaps(deals[i].dealname)
           const res =  await fetch(`/deals/images/${urldealname}.png`,{
                method:"GET"
            })
            if(res.status == 200){
                const blob = await res.blob()
                RenderDeal(dealsdiv,blob,deals[i])
            }else{
                console.log(res)
            }
        }
    }
 function RenderDeal(parent,img,deal){
    const dealDiv = document.createElement("div");
    dealDiv.className = "deal";
    dealDiv.style.backgroundImage = `url(${URL.createObjectURL(img)})`;
    dealDiv.innerHTML = `<h3>${deal.dealname}</h3><p>${deal.description}</p>`;
    parent.appendChild(dealDiv);
}

export default GetDealsImagesAndRenderDeals