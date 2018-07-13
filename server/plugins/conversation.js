var chrono = require('chrono-node')
var axios = require('axios')

var instance = axios.create({
    baseURL: 'http://lookup.dbpedia.org/api/search.asmx/KeywordSearch?',
    headers: {'Accept':'application/json'}
  });

exports.getConversation = function(text,cb) {
    let date=chrono.parseDate(text) 
    console.log("parsed to string:--",date)
    // console.log("parsed to string:--",date.toString())
    
    if(date){
        cb(null, {action:"insert",text:"Your appointment is booked on "+date.toString(),date:date})
    }else{
        cb(null, "No date found" )
    }
        // cb(null, "I would call it " + parsed.out('text'));
}

exports.getListAppointment = function(text,cb) {
    // console.log("parsed to text:--",text)
    
    // if(!text || text.length===0)
    //     text='Today' 
    let date=chrono.parseDate(text) 
    // console.log("parsed to string:--",date)
    // console.log("parsed to string:--",date.toString())
    
    if(date){
        let message=this.message
        let indexOf=(message.words).indexOf("upcoming")
        if(indexOf==-1){
            cb(null, {action:"get",text:"List of allappointment is booked on "+date.toString(),date:date});
        }else{
            cb(null, {action:"upcoming_get",text:"List of all upcoming appointment is booked on "+date.toString(),date:date});
        }
    }else{
        cb(null, "No date found" );
        // cb(null, "I would call it " + parsed.out('text'));
    }
}

exports.getDeleteAppointment = function(text,cb) {
    
    let date=chrono.parseDate(text) 
    console.log("parsed to string:--",date)
    // console.log("parsed to string:--",date.toString())
    
    if(date){
        // that.message.props['color'] = "insert";
        cb(null, {action:"delete",text:"Delete all appointment booked on "+date.toString(),date:date});
    }else
        cb(null, "No date found" );
        // cb(null, "I would call it " + parsed.out('text'));
}
  
  
exports.isDateAvailable=function(value,cb) {    
    console.log("Value:--",value)
    let date=chrono.parseDate(value) 
    console.log("Date:--",date)
    if(date)
    cb(null,true)
        else
    cb(null,false)
}

exports.getMapLocation=function (cb) {
    let d=`<html>
    <body>
    
    <h1>We found your current location</h1>
    
    <div id="map" style="width:200px;height:150px;background:yellow"></div>
    
    <script>
    function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(22,73),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    }
    </script>
    
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCcxdVJ4HDr3orO0NCJu-7pQZDJLIuJCJM&callback=myMap"></script>

    </body>
    </html>`

    cb(null,d.toString())
}

exports.getDbPediaSearch= function (text,cb) {   
    console.log("Message:--")
    axios.get('http://lookup.dbpedia.org/api/search.asmx/KeywordSearch?QueryClass=&QueryString='+text)
        .then(function (response) { 

            let result=response.data;
            if(result){
                let resultArray=result.results;

                if(resultArray.length>0)
                {
                    let dataObj=resultArray[0]

                    callDBPediaAPI(dataObj,cb)
                    // console.log("response.dbpedia:--> ",resultDbPedia)
                    
                }else{
                    cb(null,"Let's talk about another topic.")    
                }
            }else{
                cb(null,"Let's talk about another topic.")   
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}

exports.openWebbuilder = function(text,cb) {
    let redirectUrl = 'https://'+text+'.flowzdigital.com'
    let obj = {
        text: redirectUrl,
        action: 'location'
    }
    cb(null,obj)
}

 function callDBPediaAPI(dataObj,cb) {
    console.log("response.data:--> ",dataObj.uri)

    let BASE_URL="http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="
    let QUERY_PREFIX=`PREFIX owl: <http://www.w3.org/2002/07/owl#>
                    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                    PREFIX dc: <http://purl.org/dc/elements/1.1/>
                    PREFIX : <http://dbpedia.org/resource/>
                    PREFIX dbpedia2: <http://dbpedia.org/property/>
                    PREFIX dbpedia: <http://dbpedia.org/>
                    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                    PREFIX onto: <http://dbpedia.org/ontology/>
                    PREFIX purl: <http://purl.org/dc/terms/>`

    callDBPediaResourcesCategory(BASE_URL,QUERY_PREFIX,dataObj.uri,callDbPediaResoucesType,cb)

}

 function callDBPediaResourcesCategory(baseURL,queryPrefix,resourceId,cb,rCb) {
    console.log("callDBPediaResourcesCategory: --",resourceId)
    let QUERY_URL=`SELECT *
            WHERE {<`+resourceId+`> <http://purl.org/dc/terms/subject> ?categories }`
    
    let mainUrl=baseURL + encodeURIComponent( (queryPrefix + QUERY_URL).replace(/\n+/g,''))+'&output=json';
    
    // console.log("Category Url:--",mainUrl)
     axios.get(mainUrl).then(result=>{
        let bindings=result.data.results.bindings;
        // console.log("Category: --",bindings)
        cb(baseURL,queryPrefix,resourceId,bindings,callDbPediaSnorql,rCb);
    }).catch(error=>{
        console.log("Category Error:  --",error)
    })
}

function callDbPediaResoucesType(baseURL,queryPrefix,resourceId,categories,cb,rCb) {
    console.log("callDbPediaResoucesType: --")
    let QUERY_URL=` select distinct ?property ?label {
        { <`+resourceId+`> ?property ?o }
        union
        { ?s ?property <`+resourceId+`>}
    
        optional { 
        ?property <http://www.w3.org/2000/01/rdf-schema#label> ?label .
        filter langMatches(lang(?label), 'en')
        }
    }`

    let mainUrl=baseURL + encodeURIComponent( (queryPrefix + QUERY_URL).replace(/\n+/g,''))+'&output=json';


    axios.get(mainUrl).then(result=>{
            let bindings=result.data.results.bindings;
            // console.log("Types: --",bindings)
            cb(baseURL,queryPrefix,resourceId,categories,bindings,rCb);
    })
}

function callDbPediaSnorql(baseURL,queryPrefix,resourceId,categories,arrayTypes,rCb) {
    console.log("--:callDbPediaSnorql:--")
    let dataQuery=`select * where { `

    categories.forEach(element => {
        dataQuery= dataQuery.concat(' ?subject purl:subject <'+element.categories.value+'> .' )
        
    });

    let primisesArray=[];
    var resultArray={text:'Result found'};
    var resultObj={}
    arrayTypes.forEach(element => {
        
        console.log("element:--",element)
        let property=element.property;
        let label=element.label;
        if(label){
        let pValue=property.value;
        let lastSegment=pValue.substr(pValue.lastIndexOf('/') + 1);
        let  hasQuery=  dataQuery.concat(' ?subject <'+pValue+'> ?'+lastSegment)
            if(lastSegment==='abstract')
                hasQuery=  hasQuery.concat(" filter langMatches(lang(?abstract), 'en')")
            hasQuery=  hasQuery.concat(" }")
       //+ ' filter langMatches(lang(?label), \'en\') }' )
    //    hasQuery=hasQuery.concat(' filter(langMatches(lang(?'+lastSegment+'),"en"))} ')

        let mainUrl=baseURL + encodeURIComponent( (queryPrefix + hasQuery).replace(/\n+/g,''))+'&output=json';
       

          primisesArray.push(axios.get(mainUrl).then(response=>{
            response.data.results.label=label.value
            response.data.results.property=lastSegment
            return response}).catch(error=>{}))
         
        }
          
    })

   
// 
        let req=primisesArray.slice(0, 30)
        // console.log("<---Primise:--->",req.length)
        axios.all(req).then(values=>
            {
                // console.log("values--------->",values[0].data)
                    values.forEach(element => {
                        // console.log("element--------->",element.data)
                        let results=element.data.results;
                        let bindings=results.bindings;
                        // console.log("Resilt : "+lastSegment+"-->>",bindings)
                        if(bindings.length>0)
                        {
                            // console.log("Result :-->>",bindings)
                             let resultBind=bindings[0];
                            // let keys=Object.keys(resultBind)
                            
                             let value=resultBind[results.property].value
                            //  console.log("Last Rsult:--"+ keys[1] +'--->'+value)
                            let data={key:results.label,value}
                            resultObj[results.property]=data
                        }
                        })
                        resultArray.action='dbpedia';
                resultArray.search=resultObj
                // console.log("resultArray--------->",resultArray);
                
                rCb(null,resultArray);
                
            }).catch(error=>{
                console.log("resultArray error--------->",error.message);
            })       
}
