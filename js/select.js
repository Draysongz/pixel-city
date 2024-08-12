var msgOpen = false;
var x, y, x1, x2, y1, y2, xPressedL, yPressedU,xPressedR, yPressedD, xL, xR, yU, yD, mouseX, mouseY, ctx, canvas, imgTransp, overlap, rect, selectType;

$(document).ready(function() {
	// Creates a new canvas element and appends it as a child
    // to the parent element, and returns the reference to
    // the newly created canvas element
    
    
    canvas = document.getElementById('gridCanvas');
    imgTransp = document.getElementById('gridTransp');
    ctx = canvas.getContext('2d');
    
    onmousemove = function(e){
    	mouseX = e.clientX;
    	mouseY = e.clientY;
    }
    
    ontouchstart = function(e){
    	mouseX = e.touches[0].clientX;
    	mouseY = e.touches[0].clientY;
    }
    
    ontouchmove = function(e){
    	mouseX = e.touches[0].clientX;
    	mouseY = e.touches[0].clientY;
    }
           
    init();
    
    function init() {
        // bind mouse events
		imgTransp.onmousedown = function(e) {
			closeOverlapMsg();
        	closeSelectMsg();
            canvas.isDrawing = true;
            setPressedSquare(e, x, y);
            dragDraw(e, x, y);
        };
        
	    imgTransp.onmousemove = function(e) {		        
        	
		        rect = e.target.getBoundingClientRect();
		        x = e.clientX - rect.left; //x position within the element.
		        y = e.clientY - rect.top;  //y position within the element.op;            
	            dragDraw(e, x, y);
        };
        
        document.onmouseup = function(e) { 
        	
            if(canvas.isDrawing) {
            	
            	if (selectType == 'order') {
            		checkOverlap(xL, yU, xR, yD);
                	if(overlap == false) {
                		msgOpen = true;
                		var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                		var top = scrollTop + mouseY;
                		var left = Math.min(800, mouseX);
                		left = Math.max(0, mouseX);
                		openSelectMsg(top, left);
                	
                	} else if(overlap) {
                		msgOpen = true;
                		var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                		var top = scrollTop + mouseY;
                		var	left = Math.min(800, mouseX);
                		left = Math.max(0, mouseX);
                		openOverlapMsg(top, left);
                	}
            	} else if (selectType == 'lottery'){
            		openNewAreaLotteryMsg(e, xL, yU, xR, yD);
            	}
            }
            canvas.isDrawing = false;
        };           
     }
});

function checkOverlap(xL, yU, xR, yD) {
	console.log(xL, yU, xR, yD);
	var parsedList = JSON.parse(orderMiniList);
	//Check if overlaps with existing areas
	overlap = true;
	if(parsedList.length > 0) {
		for (let i = 0; i < parsedList.length; i++) {            		
			var area = parsedList[i];
			if(xL > area.xR || xR < area.xL || yU > area.yD || yD < area.yU || !area.xL|| area.xR == null || !area.yU || !area.yD ) { // is to the right or left or up or down
				overlap = false;
			} else {
				overlap = true;
				break;
			} 	
		}
	} else {
		overlap = false;
	}
	
	return overlap;
}

function openOverlapMsg(top, left) {
	
	$('#overlapMsgDiv').css( "top", top + "px");
	$('#overlapMsgDiv').css( "left", left + "px" );
	$('#overlapMsgDiv').css( "display", "block" );
}

function openSelectMsg(top, left) {
	
	$('#selectMsgDiv').css( "top", top + "px");
	$('#selectMsgDiv').css( "left", left + "px" );
	//Set pixel amount;
	clearBuyFormFields();
	updatePixelField2 (xL , yU, xR, yD);
	generateOrderId();
	$('#selectMsgDiv').css( "display", "block" );
	msgOpen = true;
}

function closeOverlapMsg() {
	$('#overlapMsgDiv').css( "display", "none" );
	msgOpen = false;
}

function closeSelectMsg() {
	$('#selectMsgDiv').css( "display", "none" );
	msgOpen = false;
}

function openBuyModal() {
	msgOpen = false;
	$('#overlapMsgDiv').css( "display", "none" );
	$('#selectpMsgDiv').css( "display", "none" );
	previous_fs = $('#fieldset1');
	current_fs = $('#fieldset3');
	next_fs = $('#fieldset2');

	$('#account').addClass('active'); //Choose px
	$('#personal').addClass('active'); //Upload
	$('#payment').removeClass('active'); //Payment
	$('#confirm').removeClass('active'); //Finish

	jQuery('#fieldset3').css('opacity', '1');
	$('#fieldset1').hide();
	$('#fieldset2').hide();
	$('#fieldset3').show();
	$('#fieldset4').hide();

	$('#buy').modal('show');
	closeSelectMsg();
}
 
function setPressedSquare(e, x, y) {
	rect = e.target.getBoundingClientRect();
	xPressedL =  Math.floor(x/10) * 10;
	xPressedR = xPressedL + 9;
	yPressedU =  Math.floor(y/10) * 10;
	yPressedD = yPressedU + 9;
	
//	if(isTouchDevice()) {
//		canvas.isDrawing = true;
//	}
//	console.log('pressed: xPressedL=' + xPressedL + ',xPressedR=' + xPressedR + ',yPressedU=' + yPressedU + ',yPressedD=' + yPressedD);
}

function dragDraw(e, x, y) {

	x1 =  Math.floor(x/10) * 10;
	y1 =  Math.floor(y/10) * 10;
	
	if(msgOpen == false) {
	ctx.clearRect(0, 0, 1000, 1000);
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.fillStyle = actionColor;
	}
	if (!canvas.isDrawing && msgOpen == false) {
		ctx.fillRect(x1, y1, 10, 10);
       
    } else if(canvas.isDrawing) {
    	
    	//Normalizing pointer values
    	x1 = Math.max(0, x1);
    	x1 = Math.min(999, x1);
    	y1 = Math.max(0, y1);
    	y1 = Math.min(999, y1);
    	
    	if(xPressedL > x) { //Dragging left
          	xL = x1;
            xR = xPressedR;
          } else { //Dragging right
          	xL = xPressedL;
            xR = x1 + 9;
          }
          
          if(yPressedU > y) { //Dragging up
          	yU = y1;
            yD = yPressedD;
          } else { //Dragging down
          	yU = yPressedU;
            yD = y1 + 9;
          }
          ctx.fillRect(xL, yU+1, xR - xL, yD - yU);    
    }
	ctx.closePath();
}

function openNewAreaLotteryMsg(e, xL, yU, xR, yD) {
	var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	var top = scrollTop + mouseY;
	var left = Math.min(800, mouseX);
	left = Math.max(0, mouseX);
	$('#lotteryAreaSelectMsgDiv').css( "top", top + "px");
	$('#lotteryAreaSelectMsgDiv').css( "left", left + "px" );
	$('#selectedLotteryPx').text(xL + ', ' + yU + ', ' + xR + ', ' + yD);
	$('#lotteryAreaSelectMsgDiv').css( "display", "block" );
	msgOpen = true;
}

function closeNewAreaLotteryMsg() {
	$('#lotteryAreaSelectMsgDiv').css( "display", "none" );
	$('#selectedLotteryPx').text('');
	msgOpen = false;
}

function openNewAreaLotteryErrorMsg() {
	var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	var top = scrollTop + mouseY;
	var	left = Math.min(800, mouseX);
	left = Math.max(0, mouseX);
	$('#newAreaLotteryErrorMsgDiv').css( "top", top + "px");
	$('#newAreaLotteryErrorMsgDiv').css( "left", left + "px" );
	$('#newAreaLotteryErrorMsgDiv').css( "display", "block" );
}

function closeNewAreaLotteryErrorMsg() {
	$('#newAreaLotteryErrorMsgDiv').css( "display", "none" );
	$('#selectedLotteryPx').text('');
	msgOpen = false;
}

function createNewAreaLottery() {
	closeNewAreaLotteryErrorMsg();
	closeNewAreaLotteryMsg();
	msgOpen = false;
	if (xL >= 0 && yU >= 0 && xR >= 0 && yD >= 0 
	&& xL <= 999 && yU <= 999 && xR <= 999 && yD <= 999 
	&& xL < xR && yU < yD) {
		let data = new FormData();
		data.append('xR'+ xR);
		data.append('xL', xL);
		data.append('yU', yU);
		data.append('yD', yD);
		
		$.ajax({
		    type: "POST",
		    url: 'lotteries/newArea',
		    data: data,
		    contentType: false,
		    processData: false,
		    success: function (response) {
		    	if (response == "success") {
		    		location.reload();
		    	} else if (response == "emptyLottery") {
		    		alert("The selected area had no private orders in it resulting in an empty lottery. Please try again!");
		    	}
		      },
		      error: function (xhr, ajaxOptions, thrownError) {
		    	  alert("Something went wrong when creating new lottery. Please try again!");
		      }
		});
	} else {
		openNewAreaLotteryErrorMsg();
	}
}

var isZooming = true;
document.addEventListener("touchstart", function(e){ if(e.touches.length > 1) {isZooming = true;} else {isZooming = false;} });
document.addEventListener("touchmove", function(e){ if(e.touches.length > 1) {isZooming = true;} else {isZooming = false;} });

function touchstarted(e) {

//	if (e.touches.length === 1 && isZooming == false) {
//		e.preventDefault();
//		
//		rect = e.target.getBoundingClientRect();
//		dragDraw(e, Math.round(e.touches[0].clientX - rect.left), Math.round(e.touches[0].clientY - rect.top));
//		setPressedSquare(e, Math.round(e.touches[0].clientX - rect.left), Math.round(e.touches[0].clientY - rect.top));
//		canvas.isDrawing = true;
//	} else {
//		scaling = true;
//	}	
}



function touchmoved(e) {

//	if (canvas.isDrawing && e.touches.length === 1 && isZooming == false) {
//		e.preventDefault();
//		ctx.clearRect(0, 0, 1000, 1000);
//		rect = e.target.getBoundingClientRect();
//		dragDraw(e, Math.round(e.touches[0].clientX - rect.left), Math.round(e.touches[0].clientY - rect.top));
//	} else {
//		scaling = true;
//	}
}

function imgTouchEnd(e) {
//	if(canvas.isDrawing && e.touches.length === 1 && isZooming == false) {
//		var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
//		var top = 100;
//		var	left = 100;
//		
//		
//    	if (selectType == 'order') {
//    		checkOverlap(xL, yU, xR, yD);
//        	if(overlap == false) {
//        		msgOpen = true;
//        		openSelectMsg(top, left);
//        	
//        	} else if(overlap) {
//        		msgOpen = true;    		
//        		openOverlapMsg(top, left);
//        	}
//    	} else if (selectType == 'lottery'){
//    		openNewAreaLotteryMsg(e, xL, yU, xR, yD);
//    	}
//    }
//    canvas.isDrawing = false;
//    var scale = window.visualViewport.scale;
//    $('.smallMsgDivActBtn').css({ fontSize : 1/scale + "rem" , width : 280/scale + "px" });
//    	.smallMsgDiv
//    	.smallMsgDivCloseBtn   	
//    	.smallMsgDivP
    //alert(window.visualViewport.scale);
}
