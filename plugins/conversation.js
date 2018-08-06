var chrono = require('chrono-node')
var axios = require('axios')

var instance = axios.create({
    baseURL: 'http://lookup.dbpedia.org/api/search.asmx/KeywordSearch?',
    headers: {'Accept':'application/json'}
  });

exports.getConversation = function(text,cb) {
    let date=chrono.parseDate(text) 
    console.log("parsed to string:--",date)
    
    if(date){
        cb(null, {action:"insert",text:"Your appointment is booked on "+date.toString(),date:date})
    }else{
        cb(null, "No date found" )
    }
}

exports.getProductDetail = function(text,cb) {
    console.log('text',text)
    axios.get('https://api.flowzdigital.com/pdmnew/pdm/US?sku='+text,{ headers: { vid: '14f00a26-d2e4-4a14-820b-4867f6ee6174' }})
    .then(function (response) {
        console.log('response',response.data)
        if(response.data.hits.total) {
            // if(response.data.hits.total==1)
            // {
                let name = response.data.hits.hits[0]._source.product_name;
                // let image = 'http://image.promoworld.ca/migration-api-hidden-new/web/images/'+ response.data.hits.hits[0]._source.default_image
                let image = response.data.hits.hits[0]._source.images[0].images[0].secure_url
                let imageTag = '<div style="border:1px solid #333;width:fit-content;"><img style="height:-webkit-fill-available;width:auto;" src="'+image+'"><br/><label>'+name+'</label></div>'
                // let imageTag = '<img style="height:50px;width:50px;" src="https://4.imimg.com/data4/XD/CE/MY-8383700/abstract-geometric-3d-wallpaper-with-red-rose-flower-500x500.jpg"/><br/><label>name</label>';
                if(name) {
                    let obj = {
                        type: 'html',
                        string: imageTag
                    }
                    cb(null,obj)
                }
                else {
                    cb(null,"Sorry, we are not able to find detail. Try another.")   
                }
            // }
            // else {
            //     cb(null,"We find more than one results. Try another.")   
            // }
        }
        else {
            cb(null,"SKU is invalid. Try another.")   
        }
    })
    .catch(function (error) {
        console.log(error);
        cb(null,"Sorry, we are not able connect. Try after sometime.")
    });
}

exports.getListAppointment = function(text,cb) {
    let date=chrono.parseDate(text) 
    
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

exports.getPriceBySku = function(text,cb) {
    axios.get('https://api.flowzcluster.tk/pdmnew/pdm/US?sku='+text,{ headers: { vid: '226b8796-f916-4ec0-9286-7df49ebfae22' }})
    .then(function (response) {
        if(response.data.hits.total) {
            if(response.data.hits.total==1)
            {
                let result = response.data.hits.hits[0]._source.price_1.toString();
                if(result) {
                    let obj = {
                        text: result
                    }
                    cb(null,obj)
                }
                else {
                    cb(null,"Sorry, we are not able to find price. Try another.")   
                }
            }
            else {
                cb(null,"We find more than one results. Try another.")   
            }
        }
        else {
            cb(null,"SKU is invalid. Try another.")   
        }
    })
    .catch(function (error) {
        console.log(error);
        cb(null,"Sorry, we are not able connect. Try after sometime.")
    });
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
    
     axios.get(mainUrl).then(result=>{
        let bindings=result.data.results.bindings;
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
    var resultArray={text:'No Result found'};
    var resultObj={}
    arrayTypes.forEach(element => {
        console.log("element:--",element)
        let property=element.property;
        let label=element.label;

        if(label) {
            let pValue=property.value;
            let lastSegment=pValue.substr(pValue.lastIndexOf('/') + 1);
            let hasQuery=  dataQuery.concat(' ?subject <'+pValue+'> ?'+lastSegment)
            if(lastSegment==='abstract')
                hasQuery=  hasQuery.concat(" filter langMatches(lang(?abstract), 'en')")
            hasQuery=  hasQuery.concat(" }")

            let mainUrl=baseURL + encodeURIComponent( (queryPrefix + hasQuery).replace(/\n+/g,''))+'&output=json';

            primisesArray.push(axios.get(mainUrl).then(response=>{
                response.data.results.label=label.value
                response.data.results.property=lastSegment
                return response
            }).catch(error=>{

            }))
        }
    })

   
    let req=primisesArray.slice(0, 30)
    axios.all(req).then(values=>
        {
            values.forEach(element => {
                let results=element.data.results;
                let bindings=results.bindings;
                if(bindings.length>0)
                {
                    let resultBind=bindings[0];
                    let value=resultBind[results.property].value
                    let data={key:results.label,value}
                    resultObj[results.property]=data
                }
            })
            resultArray.action='dbpedia';
            resultArray.search=resultObj
            
            rCb(null,resultArray);
        }).catch(error=>{
            console.log("resultArray error--------->",error.message);
        })       
}
