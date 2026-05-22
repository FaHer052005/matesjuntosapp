// ─── SEED DATA ────────────────────────────────────────────
const SEED_PRODS = [
  {id:"p1",name:"Mate Calabaza Natural",desc:"Mate tradicional de calabaza curada a mano",price:1800,cost:800,stock:20,minStock:5,category:"mate"},
  {id:"p2",name:"Mate Silicona Estampado",desc:"Diseños exclusivos Mates Juntos",price:2500,cost:1100,stock:15,minStock:5,category:"mate"},
  {id:"p3",name:"Mate Madera Tornillo",desc:"Artesanal, curado, con pico de metal",price:3200,cost:1400,stock:8,minStock:3,category:"mate"},
  {id:"p4",name:"Bombilla Alpaca Espiral",desc:"Filtro espiral premium, alpaca",price:950,cost:380,stock:30,minStock:8,category:"bombilla"},
  {id:"p5",name:"Bombilla Acero Cebador",desc:"Acero inox, cebado perfecto sin taparse",price:1400,cost:560,stock:4,minStock:8,category:"bombilla"},
  {id:"p6",name:"Termo Stanley 750ml",desc:"Stanley verde mate, 750ml, 24hs frío/calor",price:12500,cost:7000,stock:8,minStock:3,category:"termo"},
  {id:"p7",name:"Termo Lumilagro 1L",desc:"Lumilagro clásico, 1 litro",price:3800,cost:1900,stock:2,minStock:4,category:"termo"},
  {id:"p8",name:"Yerba CBSé 500g",desc:"Suave, equilibrada, 500g",price:890,cost:520,stock:40,minStock:10,category:"yerba"},
  {id:"p9",name:"Yerba Taragüi 1kg",desc:"Taragüi tradicional, 1 kilogramo",price:1650,cost:980,stock:25,minStock:8,category:"yerba"},
  {id:"p10",name:"Yerbera Cerámica",desc:"Artesanal esmaltada, cierre hermético",price:2200,cost:950,stock:12,minStock:4,category:"accesorio"},
  {id:"p11",name:"Kit Mate Completo",desc:"Mate + bombilla + yerbera coordinados",price:4500,cost:2100,stock:6,minStock:3,category:"accesorio"},
];

const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2,5);

const genSales = (prods) => {
  const out = [], now = new Date();
  for (let d=29;d>=0;d--) {
    const dt = new Date(now); dt.setDate(dt.getDate()-d);
    const n = Math.floor(Math.random()*5);
    for (let j=0;j<n;j++) {
      const used=new Set(), items=[];
      let tot=0,prft=0;
      const ni=Math.floor(Math.random()*3)+1;
      for(let k=0;k<ni;k++){
        let i; do{i=Math.floor(Math.random()*prods.length);}while(used.has(i));
        used.add(i);
        const p=prods[i],q=Math.floor(Math.random()*2)+1;
        items.push({productId:p.id,productName:p.name,category:p.category,quantity:q,unitPrice:p.price,unitCost:p.cost});
        tot+=p.price*q; prft+=(p.price-p.cost)*q;
      }
      out.push({id:uid(),date:dt.toISOString(),items,paymentMethod:PMTS[Math.floor(Math.random()*PMTS.length)],total:tot,profit:prft,note:""});
    }
  }
  return out;
};
