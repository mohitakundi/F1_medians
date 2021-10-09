

let json;
let Xurl;
let newurl;

let racename;

let totaldrivers=0;
let drivername_arr=[];
let drivercode_arr=[];
let medianlaptime_arr=[];

let firstname=[];
let lastname=[];

 let graphlaptime_arr=[];

let jsonX;
let driverurl;
let stdurl;

let driverno=0;
let isloaded=0;

let select_year='current';
let select_round=1;

function preload() {

  let url = "https://ergast.com/api/f1/current/drivers.json";
  json = loadJSON(url);
  img = loadImage('GP_CAR2.png');
  imgW = loadImage('GP_CAR2G.png');
  // let urlX="https://ergast.com/api/f1/2021/1/laps?limit=1026";
  // jsonX = loadJSON(urlX);

}

function setup() {
  createCanvas(1500, 1500);
  
  
  
totaldrivers=json.MRData.total;print("Total Drivers: "+totaldrivers);
  
collect_drivernames();
  

//loaddriverjson();
  background(255);
  
        textSize(40);
      text('Loading...',300,300);
  
  fill(0);
  textSize(18);
  //year
  text("Year:", 300, 500+210);
  yrinput = createInput('current');
  yrinput.position(380, 500+195);
  //round
  text("Round:", 300, 500+250);
  rdinput = createInput('1');
  rdinput.position(380, 500+235);

  button = createButton('GO');
  button.position(rdinput.x + rdinput.width, 500+195);
}

function draw() {

  button.mousePressed(setyear);
  
  if(isloaded==1&&driverno<totaldrivers)
    {isloaded=0;
      loaddriverjson();
    }
  else if(isloaded==1&&driverno>=totaldrivers)
          {isloaded=0;
            for(let ctr=0;ctr<totaldrivers;)
            {
              print(drivername_arr[ctr]+": "+medianlaptime_arr[ctr]); 
              ctr++
              if(ctr==totaldrivers){drawchart();}
            }
           
          }
}

function collect_drivernames()
{  totaldrivers=json.MRData.total;print("Total Drivers: "+totaldrivers);
  for(let ctr=0;ctr<totaldrivers;ctr++)
      {
    drivername_arr[ctr]=json.MRData.DriverTable.Drivers[ctr].driverId;
       firstname[ctr]=json.MRData.DriverTable.Drivers[ctr].givenName;
       lastname[ctr]=json.MRData.DriverTable.Drivers[ctr].familyName;
        
    drivercode_arr[ctr]=json.MRData.DriverTable.Drivers[ctr].code;
        if(drivercode_arr[ctr]==undefined)
           {           drivercode_arr[ctr]=json.MRData.DriverTable.Drivers[ctr].driverId;
           }
        
        print(drivername_arr[ctr]);
      }driverno=0;
 
 loaddriverjson();
 
}

function loaddriverjson()
{
  stdurl = "https://ergast.com/api/f1/current/round/drivers/drivername/laps.json?limit=100";
driverurl = stdurl.replace('drivername', drivername_arr[driverno]);
  
driverurl = driverurl.replace('current', select_year);

driverurl = driverurl.replace('round', select_round);
  
  jsonX = loadJSON(driverurl,find_median_laptimes);
}
function find_median_laptimes()
{
  let laptime_arr=[];
  
  try
    {
    racename=jsonX.MRData.RaceTable.Races[0].raceName;
    }
    catch(err)
      {
        console.log('NO LAP');medianlaptime_arr[driverno]='NO LAP';
        driverno++;
  isloaded=1;return;
      }
  
  let totallaps=jsonX.MRData.total;
print(driverurl);
  print(jsonX.MRData.RaceTable.driverId);
  print('Total Laps: '+jsonX.MRData.total);
  
  totallaps=int(totallaps);
print(totallaps);
  
  for(let ctr=0;ctr<totallaps;ctr++)
      {
  let temp=jsonX.MRData.RaceTable.Races[0].Laps[ctr].Timings[0].time;
        
        //CONVERT MINS TO SECONDS
        let temp_min_arr=split(temp,':');
        
        temp_min_arr[0]=float(temp_min_arr[0]);
        temp_min_arr[1]=float(temp_min_arr[1]);
        
        temp_min_arr[0]=temp_min_arr[0]*60;
        
        laptime_arr[ctr]=temp_min_arr[0]+temp_min_arr[1];
        //END OF CONVERT
        
        //laptime_arr[ctr]=temp.replace(':','.');
        
        //laptime_arr[ctr]=float(laptime_arr[ctr]);;
      }
  
  laptime_arr.sort(compareNumbers);//SORT LAPTIMES
  
 
  
  
      for(let ctr=0;ctr<totallaps;ctr++)
      {
print(laptime_arr[ctr]);
        
      }
  
  let median=int(laptime_arr.length/2);
  print("Array Length: "+laptime_arr.length);
  
   let stringtime=convert_minutes(laptime_arr[median]);
  print("StringTime: "+stringtime)//Convert Back to Minutes and Print
  
  print("median laptime : "+laptime_arr[median]);
  print("Driver Name : "+drivername_arr[driverno]);
  
  


  medianlaptime_arr[driverno]=laptime_arr[median];
driverno++;
  isloaded=1;
}

function convert_minutes(median_laptime)
{
  if(median_laptime=='NO LAP')
     {
     return median_laptime;
     }
  median_laptime=float(median_laptime);
  let minutes=int(median_laptime/60);
  let seconds=median_laptime-(minutes*60);
  seconds=round(seconds,3);//round off to 3 places
  
  return str(minutes+':'+seconds);
}


function setyear()
{
  let chkyear=int(yrinput.value());
  let chkround=int(rdinput.value());
  select_year=yrinput.value();
  select_round=rdinput.value();
  if(chkyear>=1996&&chkyear<4000&&chkround>0&&chkround<30)
    {
        background(255);
      textSize(40);
      text('Loading...',300,300);
      textSize(18);
      load_drivernames();
    }
  
}
function load_drivernames()
{
 Xurl = "https://ergast.com/api/f1/2021/drivers.json";
  
newurl = Xurl.replace('2021', select_year);
  print(newurl);
  

  
  json = loadJSON(newurl,collect_drivernames);
}

function drawchart()
{let graphlaptime_arr=[];
  background(255);
       text("Year:", 300, 500+210);
  text("Round:", 300, 500+250);
 
  for(c=0;c<totaldrivers;c++)
  {
    if(medianlaptime_arr[c]=='NO LAP')
       {
       continue;
       }
    else
      {
     graphlaptime_arr[c]=medianlaptime_arr[c];
      }
   
  }
   graphlaptime_arr.sort(compareNumbers);
 
    //years
  for(i=0;i<totaldrivers;i++)
  {
    text(drivercode_arr[i][0].toUpperCase()+drivercode_arr[i][1].toUpperCase()+drivercode_arr[i][2].toUpperCase()+' ', i * 50, 520+85);
      print(drivercode_arr[i]);
    textSize(10);
    let texlap=convert_minutes(medianlaptime_arr[i]);
    text(texlap+'  ', i * 50, 540+85);
      print(medianlaptime_arr[i]);
    
    textSize(24);
    text(racename,20,520+155);//print race name
    text("Driver's Median Laptimes",300,520+155);
    textSize(18);

//print("Worst Median Laptime:"+graphlaptime_arr[0] );
  let graphlaptime=((medianlaptime_arr[i]-graphlaptime_arr[0])*50)+1;
    
  // textSize(10); text(graphlaptime+'  ', i * 50, 560+85);//temp
    
    //graph
   //rect(i * 50, 500 - graphlaptime, 20, graphlaptime);
    
    if(medianlaptime_arr[i]-graphlaptime_arr[0]==0)
       {
       image(imgW,i * 50,500 - graphlaptime,55,55);
       }
    else{image(img,i * 50,500 - graphlaptime,55,55);}
    
  for(ctr=0;ctr<3;ctr++){chequered_flag(i,ctr);fill(0,0,0);}
    
    //Driver Code to Drivername List
    
       text(drivercode_arr[i][0].toUpperCase()+drivercode_arr[i][1].toUpperCase()+drivercode_arr[i][2].toUpperCase()+': '+firstname[i]+' '+lastname[i], 20, 520+190+(i*20));
    
    //-------------------------------
    
  }
}


function chequered_flag(i,ctr)
{
  if(i%2==0)
    {fill(255,255,255);}else{fill(0,0,0);}
  
  for(let c=0;c<(totaldrivers/2)-1;c++)
{
  if(ctr%2==0){
  square((i*10)+(c*100), 500+55+(ctr*10), 10);}
  else{square((i*10+10)+(c*100), 500+55+(ctr*10), 10);}
}
  
}

function compareNumbers(a, b) {
  return a - b;
}
function compareNumbersRev(b, a) {
  return a - b;
}
