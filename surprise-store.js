/* A small, local-only keepsake album. Invalid saved entries never enter the UI. */
(()=>{'use strict';const MB=window.MB=window.MB||{};
 MB.createSurpriseStore=function(storage,ids){
  const key='mom-keepsakes-v1',allowed=new Set(ids);let records={},persistent=true;
  function clean(value){const result={};if(!value||typeof value!=='object'||Array.isArray(value))return result;for(const id of ids){const r=value[id];if(!r||typeof r!=='object'||r.done!==true)continue;result[id]={done:true,variant:Number.isInteger(r.variant)&&r.variant>=0&&r.variant<=2?r.variant:0,flowers:Number.isInteger(r.flowers)&&r.flowers>0&&r.flowers<=7?r.flowers:7,date:typeof r.date==='string'&&/^\d{4}\.\d{2}\.\d{2}$/.test(r.date)?r.date:''};}return result;}
  try{records=clean(JSON.parse(storage.getItem(key)||'{}'));}catch(_){persistent=false;}
  return {get(id){return records[id]?{...records[id]}:null;},get count(){return Object.keys(records).length;},get persistent(){return persistent;},save(id,value){if(!allowed.has(id))return;const item=clean({[id]:{...value,done:true}})[id];records[id]=item;try{storage.setItem(key,JSON.stringify(records));persistent=true;}catch(_){persistent=false;}return {...item};}};
 };
})();
