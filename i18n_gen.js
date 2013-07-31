$(document).ready(function(){

	var t1= $("body");
	var t2= $("body").clone();
	var qualifier = ""; //get it dynamically
	var htmlQualifier = "home.";
	var originalColList = [];
	var fakeColList = [];
	var id = 0;
	eltree(t1,originalColList)
	id=0;
	eltree(t2,fakeColList)
	function eltree(el, colList){
		if(el.children().length == 0 ){
			var col = {}
			col.id = id++;
			col.obj = el;
			col.text = $.trim(el.text().replace(/\n/g,''));
			if($.trim(el.text()) !="")
				colList.push(col);
			return ;
		}else if(el.children().length != 0 ){
			var isTextNodeCase = $.trim($(el).clone().children().remove().end().text()) =="" 
			isTextNodeCase = !isTextNodeCase;
			if(isTextNodeCase){
				//collect all text node, save them and call for each children
				el.contents().each(function(){
					if(this.nodeType == 3){
						var col ={}
						col.id = id++;
						col.text = $.trim($(this).text().replace(/\n/g,''));
						col.textNode = true;
						col.obj = $(this);
						if($.trim(col.text) !="") //Ah i fogot why i did this
							colList.push(col);
					}
				})
				//now call for children
				el.children().each(
						function(index){
							if(! $(this).is("script"))
								eltree($(this),colList);
						}
				);
				
			}else{
					el.children().each(
						function(index){
							if(! $(this).is("script"))
								eltree($(this),colList);
						}
					);
			}
		}
	}

	
	function handleGenerate(){
		var uniqueProperties = {};
		for(var i in fakeColList){
			var col = fakeColList[i]
			if(col.code){
				uniqueProperties[col.code] = {key : col.code , value : col.text}
				
			}
		}
		for(var x in uniqueProperties ){
			console.log('"'+uniqueProperties[x].key +'"' +":" + '"' + uniqueProperties[x].value + '",')
			
		}
		
		console.log(t2.html().replace(/&gt;/g,'>').replace(/&lt;/g,"<"));
	}
    
    function generateEditor(){
        var generateButton = $("<button>Generate</button>");
        var htmlQualifierfield = $("<input id='htmlQualifier'></input>");
        htmlQualifierfield.val('test.')
        var myDiv = $("<div class='i18n' style='height:300px;position:fixed;overflow:scroll;background-color:white;z-index:900;'></div>")
        var myBackgroundDiv = $("<div class='i18nbk' style='height:300px;'></div>")
        $("body").prepend(myBackgroundDiv);
        $("body").prepend(myDiv);
        generateButton.click(handleGenerate);
        myDiv.append(generateButton);
        myDiv.append(htmlQualifierfield);
        for( var index in originalColList){
            var col = originalColList[index]
            var fieldDiv = $("<div style='float:left;padding:8px;'></div>");
            var originalText=$("<p'></p>");
            originalText.text( col.text);
            var generatedText=$("<input></input>");
            generatedText.attr('id',col.id);
            generatedText.attr('value',qualifier); //TODO:get it dynamically
            generatedText.keyup(handleUpdate);
            generatedText.focus(handleFocus);
            generatedText.blur(hanldeBlur);
            fieldDiv.append(originalText);
            fieldDiv.append(generatedText);
            myDiv.append(fieldDiv) 
        }
    }
    
	function handleFocus(){
		var id = $(this).attr('id')
		var col = getCol(id);
		if(col.textNode){
		}else{
			col.obj.css("border","1px solid red");
		}
	}
	function hanldeBlur(){
		var id = $(this).attr('id')
		var col = getCol(id);
		if(col.textNode){
		}else{
			col.obj.css("border","none");
		}
	}
	
	function handleUpdate(){
		var id = $(this).attr('id')
		var col = getCol(id);
		var fakeCol = getFakeCol(id);
		if($.trim($(this).val()) == qualifier){ //might be another way
			var temp  = $(this).val();
			$(this).val('');
			$(this).val(temp)
			return;
		}
		if(col.textNode){
			
			
			
			
			
			col.code = $(this).val();
			fakeCol.code = $(this).val();
			//col.obj.css("background-color","#F4E189");
			//fakeCol.obj.text("<%=textPack.get('"+htmlQualifierfield.val()+$(this).val()+"')%>");
			var tempTextNode = document.createTextNode("<%= textPack.get('"+htmlQualifierfield.val()+$(this).val()+"')%>" );
			fakeCol.obj.replaceWith(tempTextNode);
			fakeCol.obj = $(tempTextNode)
		/*
		
			//temporary remove it change text then append again
			
			col.obj.children().each(function(){
				if($(this).css("background-color") == "rgb(244, 225, 137)"){
				}else{
					$(this).css("background-color","white")
				}
			});
			
			col.obj.children().remove();
			fakeCol.obj.children().remove();
			
			col.obj.css("background-color","#F4E189");
			
			fakeCol.obj.text("<%= textPack.get('"+htmlQualifierfield.val()+$(this).val()+"')%>");
			
			col.obj.append(col.objChildren);
			fakeCol.obj.append(fakeCol.objChildren);
			
			col.code = $(this).val();
			fakeCol.code = $(this).val();
			*/
		}else{
			col.code = $(this).val();
			fakeCol.code = $(this).val();
			col.obj.css("background-color","#F4E189");
			fakeCol.obj.text("<%= textPack.get('"+htmlQualifierfield.val()+$(this).val()+"')%>");
		}
		
	}
	function getCol(id){
		for(var i in originalColList){
			var col = originalColList[i]
			if(col.id == id)
				return col
		}
	}
	function getFakeCol(id){
		for(var i in fakeColList){
			var col = fakeColList[i]
			if(col.id == id)
				return col
		}
	}
    function generateJinjaTemplate(){
        for(var i in fakeColList){
			var col = fakeColList[i]
			if(col.textNode){
                var tempTextNode = document.createTextNode("{% trans %}" + col.obj.text() + "{% endtrans %}");
                col.obj.replaceWith(tempTextNode);
                col.obj = $(tempTextNode)
             }else{
                col.obj.text("{% trans %}" + col.obj.text() + "{% endtrans %}");
             }
		}
        console.log(t2.html().replace(/&gt;/g,'>').replace(/&lt;/g,"<"));
    }
    /**
    * Uncommnet following line if you want to generate jinja template file
    **/
	//generateJinjaTemplate()
    
    /**
    * Uncomment follwing line if you want to generate your own properity file
    **/
    generateEditor()
});