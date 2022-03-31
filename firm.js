const csv = require('csv') 
const fs = require('fs');
function parser(){

  const result = [];
  const repeatedProjectId = {};
  let data = [];
  let startDate;
  let endDate;
  let days;
  let months;
  let years;
  let time;
  const date = 2022-03-31;
  let nameOfFile = '/fdsfd1.csv'
  fs.createReadStream(__dirname +nameOfFile)
  .pipe(
    csv.parse({
      delimiter: ';',
    })
    )
    .on('data',(data)=>result.push(data))
    .on('end',()=>{
      for(let row of result){
         if(row[3]==='NULL'){
           row[3] = date;
        }
        data.push({
          empId:Number(row[0]),
          projectId:Number(row[1]),
          dateFrom:new Date(row[2]),
          dateTo:new Date(row[3]),
        })
      }
      for(let emp of data){
        if(!repeatedProjectId[emp.projectId]){
          repeatedProjectId[emp.projectId] = 1;
        }else{
          repeatedProjectId[emp.projectId]++; 
        }
      }
      for(let id in repeatedProjectId){
        if(repeatedProjectId[id] >= 2){
         data = data.filter(x=>x.projectId == id);
         data.sort((a,b)=>b.dateFrom - a.dateFrom)
         startDate = data[0].dateFrom;
         data.sort((a,b)=>a.dateTo - b.dateTo)
         endDate = data[0].dateTo;
        }
        days = Number(endDate.getDate()) - Number(startDate.getDate())
      months = (Number(startDate.getMonth()) + 1) - (Number(endDate.getMonth())+1);
      years = (Number(endDate.getFullYear()) - Number(startDate.getFullYear()))
      if(days < 0){
        if(months%2==0&& months==2){
          days = days + 28;
        }else if(months%2==0){
          days= days+30;
        }else{
          days = days + 31
        }
        months--;
     
         if(months < 0){
           years--;
           months = 12 + months;
         }
      }else{
        if(months<0){
          years--;
        }
      }
       if(years>0){
         time  = years*365;
       }
       
       for(let i = 1;i<2;i++){
         if(months%2 === 0 && months === 2){
            time +=  31 + days;
         }else if(months%2 === 0){
           time += 28 + months/2 * 31 + (months - months/2 -2) * 30 + days;
         }else if(months%2 === 1 &&  months > 1){
           let count = (months - 1) / 2
           time += 28 + count *31 + (count-1) * 30 + days; 
         }else{
           time += 31;
         }
       
          
      }
      }
     const finalOutput = {emp1Id: data[0].empId,emp2Id: data[1].empId,projectId: data[0].projectId, time}
     console.log(finalOutput); 
     //Cannot write new csv file
      fs.writeFileSync('/output.csv',finalOutput,(err)=>{
       if(err) throw err;
      })
      
    });
    
  }
  parser();
    
    
