

let json;
let Xurl;
let newurl;

let totaldrivers=0;
let drivername_arr=[];
let drivercode_arr=[];
let medianlaptime_arr=[];

 let graphlaptime_arr=[];

let jsonX;
let driverurl;
let stdurl;

let driverno=0;
let isloaded=0;

let select_year=2021;
let select_round=1;

function preload() {

  let url = "https://ergast.com/api/f1/2021/drivers.json";
  json = loadJSON(url);
  
  // let urlX="https://ergast.com/api/f1/2021/1/laps?limit=1026";
  // jsonX = loadJSON(urlX);

}

function setup() {
  createCanvas(1500, 1500);
totaldrivers=json.MRData.total;print("Total Drivers: "+totaldrivers);
  
collect_drivernames();
  

//loaddriverjson();
  background(255);
  fill(0);
  textSize(18);
  //year
  text("Year:", 20, 30);
  yrinput = createInput('2021');
  yrinput.position(20, 40);
  //round
  text("Round:", 20, 90);
  rdinput = createInput('1');
  rdinput.position(20, 100);

  button = createButton('GO');
  button.position(rdinput.x + rdinput.width, 100);
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
    drivercode_arr[ctr]=json.MRData.DriverTable.Drivers[ctr].code;
        print(drivername_arr[ctr]);
      }driverno=0;
 
 loaddriverjson();
 
}

function loaddriverjson()
{
  stdurl = "https://ergast.com/api/f1/2021/round/drivers/drivername/laps.json?limit=100";
driverurl = stdurl.replace('drivername', drivername_arr[driverno]);
  
driverurl = driverurl.replace('2021', select_year);

driverurl = driverurl.replace('round', select_round);
  
  jsonX = loadJSON(driverurl,find_median_laptimes);
}
function find_median_laptimes()
{
  let laptime_arr=[];
  

  
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
  median_laptime=float(median_laptime);
  let minutes=int(median_laptime/60);
  let seconds=median_laptime-(minutes*60);
  
  return str(minutes+':'+seconds);
}


function setyear()
{
  let chkyear=int(yrinput.value());
  let chkround=int(rdinput.value());
  select_year=yrinput.value();
  select_round=rdinput.value();
  if(chkyear>=1950&&chkyear<4000&&chkround>0&&chkround<30)
    {
        background(255);
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
  for(c=0;c<totaldrivers;c++)
  {
     graphlaptime_arr[c]=medianlaptime_arr[c];
   
  }
   graphlaptime_arr.sort(compareNumbers);
 
    //place years
  for(i=0;i<totaldrivers;i++)
  {
    text(drivercode_arr[i]+' ', i * 50, 520);
      print(drivercode_arr[i]);
    textSize(10);
    text(round(medianlaptime_arr[i],3)+' ', i * 50, 540);
      print(medianlaptime_arr[i]);
    textSize(18);
  
  
//print("Worst Median Laptime:"+graphlaptime_arr[0] );
  let graphlaptime=((medianlaptime_arr[i]-graphlaptime_arr[0])*50)+1;
    
    //draw graph
    rect(i * 50, 500 - graphlaptime, 20, graphlaptime)
  }
}


function compareNumbers(a, b) {
  return a - b;
}
function compareNumbersRev(b, a) {
  return a - b;
}