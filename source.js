// Web scraping in Node
const r = require('request');
const rp = require('request-promise');
var cheerio = require('cheerio'); // Basically jQuery for node.js

const options = {
	url: `https://www.hangoverprices.com/coca-cola-prices/`,
	transform: body => cheerio.load(body)
}

let cocaList = [];
let cocaList2 = [];

rp(options)
	.then(($) => {
    $('#tablepress-67 > tbody  > tr').each(function(index, element) {

      cocaList[index] = {};
      var name = $(element).find('.column-1');
	    cocaList[index]['name'] = $(name).text();
      var quantity = $(element).find('.column-2');
	    cocaList[index]['quantity'] = $(quantity).text();
      var price = $(element).find('.column-3');
	    cocaList[index]['price'] = $(price).text();

      //if(quantity = '')


      
		})
    console.log(cocaList);
    $(cocaList).each(function(index, value){
      if(cocaList[index]['quantity']=='')
      {
        console.log("-------------------"+cocaList[index]['name']+"------------------");
        //console.log("     Name        |        Quantity        |        price     ");
      }
      else
      {
        var position = cocaList[index]['quantity'].indexOf("oz");
        if(position== -1)
        {
          position = cocaList[index]['quantity'].indexOf("L");
          var quant = cocaList[index]['quantity'].split('');
          let i=0;
          let q = "";
          while(i != position)
          {
            q=q+quant[i];
            i++;
          } 

          var position2 = q.indexOf("x");
          if(position2 != -1)
          {
            i=0;
            q = "";
            let num = parseInt(quant[0]);
            while(i < position)
            {
              if((i!=0) && (quant[i]!=' ') && (quant[i]!='x'))
              {
                q=q+quant[i];
                i++;
                while((quant[i]!=' ')&&(quant[i]!='x'))
                {
                   q=q+quant[i];
                   i++;
                }
                num = num * parseInt(q);
                q = num;
              }
              else
              {
                  i++;
              }
              
            } 
          }
          q =  parseFloat(q);
          var price = cocaList[index]['price'].split('');
          var p='';
          l = price.length;
          i=1;
          while(i<l)
          {
            p=p+price[i];
            i++;
          }
          p = parseFloat(p);
          let pu = p/q;


          console.log(cocaList[index]['name'] + "  -  "+cocaList[index]['quantity']+"  -   "+cocaList[index]['price']+"  -   $"+pu+"/L");
        }
      }
    })
   console.log("success");
	})
	.catch((err) => {
		console.log(err);
    console.log("fail");
	});


