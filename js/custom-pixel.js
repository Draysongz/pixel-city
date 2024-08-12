/** Ajax csrf parameters  */
var token = $('#_csrf').attr('content');
var header = $('#_csrf_header').attr('content');

var viewportW, x, y, current_fs, next_fs, previous_fs, opacity, ctx,
pixHor, pixVert, sum, orderId, clientAddress, clientEmail, clientDiscord, clientTwitter, validated,
pixels, orderUrl, buyFrame, pixHorReal, pixVertReal, chain;
let orderFile;
var rate;
var rateCardano = 0.2;
var rateFromApp = $('#rate').val();

var actionColor = '#6290C8';
var darkColor = '#29339B';

var clickedIntro = 0;


$(document).ready(function() {	

	chain = $('#chain').val();
	if (chain == 'cardano') {rate = rateCardano;}
	if (chain == 'injective') {rate = rateFromApp;}
	if (chain == 'solana') {rate = rateFromApp;}
	checkCookie();
	
	viewportW = $(window).width();
	buyFrame = document.getElementById('container-canvas');
	
	$('.form-control').on('blur', function(event) {
		event.target.style.borderColor = actionColor;
	});
	
	$('.form-control').on('blur', function(event) {
		event.target.style.borderColor = darkColor;
	});
	
	$( ".image-upload-wrap" ).click(function() {
		$('.image-upload-wrap').css('border-color', actionColor);
		$('.image-upload-wrap').css('background-color', 'transparent');
	});
	
	$( "#clientUrl" ).click(function() {
		$('#clientUrl').css('border-color', actionColor);
		$('#clientUrl').css('background-color', 'transparent');
		$('#notValidUrl').css('color', 'transparent');
	});
	
	$('#clientAddress').click(function() {
		$('#clientAddress').css('border-color', actionColor);
		$('#clientAddress').css('background-color', 'transparent');
		$('#notValidAddress').css('color', 'transparent');
	});
	
	$( "#clientEmail" ).click(function() {
		$('#clientEmail').css('border-color', actionColor);
		$('#clientEmail').css('background-color', 'transparent');
	});
	
	$('#termsCheck').change(function() {
		if (document.getElementById('termsCheck').checked && document.getElementById('paymentCheck').checked) {
			$('#terms-p').css('color', 'transparent');
		}
	});
	
	$('#paymentCheck').change(function() {
		if (document.getElementById('termsCheck').checked && document.getElementById('paymentCheck').checked) {
			$('#terms-p').css('color', 'transparent');
		}
	});
	
	$('#closeIntroModal').click(function () {
		console.log('hide');
		$('#lotteryModal').modal('hide');	
	});

	$('#buyModalCloseBtn').click(function () {
		closeAndEmptyBuyModal();	
	});

	$('#buySuccessCloseBtn').click(function () {
		$('#buySuccess').modal('hide');		
	});
	
	$('#buyErrorCloseBtn').click(function () {
		$('#buyError').modal('hide');		
	});
	
	$('#set1NextBtn').click(function () {
		console.log("pixHorReal=" + pixHorReal + ", pixVertReal=" + pixVertReal + ", sum=" + sum);
		generateOrderId();
	});
	
	$('#set2NextBtn').click(function () {
		clientAddress = $('#clientAddress').val();
		validated = false;
		console.log("clientAddress=" + clientAddress + ", validated=" + validated + ", orderId=" + orderId);
	});
	
	$('#set3NextBtn').click(function () {
		orderFile = $('#clientPicture')[0].files[0]; 
		orderUrl = $('#clientUrl').val();
		console.log("orderFile=" + orderFile);
		console.log("orderUrl=" + orderUrl);
	});
	

	$(".next").click(function(){
		
	var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;

	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	if(current_fs.attr('id') == 'fieldset3' && !$('#clientPicture').val()) {
		console.log('no picture!!!');
		$('.image-upload-wrap').css('border-color', '#dc3545');
		$('.image-upload-wrap').css('background-color', 'rgb(253 237 238)');
//		$('.image-upload-wrap').css('color', '#dc3545;');
		return;
		
	}
	
	if (current_fs.attr('id') == 'fieldset3' && !$('#clientUrl').val()) {
		console.log('no url link!!!');
		$('#clientUrl').css('border-color', '#dc3545');
		$('#clientUrl').css('background-color', 'rgb(253 237 238)');
		$('#notValidUrl').css('color', '#dc3545');
		return;
	}
	
	if (current_fs.attr('id') == 'fieldset2') {
		if (chain != 'cardano' && ( $('#clientAddress').val().length < 31 || $('#clientAddress').val().length > 44 )) {
		console.log('not a valid address!!!');
		$('#clientAddress').css('border-color', '#dc3545');
		$('#clientAddress').css('background-color', 'rgb(253 237 238)');
		$('#notValidAddress').css('color', '#dc3545');
		return;
		}
		
	if (chain == 'cardano' && $('#clientAddress').val().length < 25 ) {
		console.log('not a valid address!!!');
		$('#clientAddress').css('border-color', '#dc3545');
		$('#clientAddress').css('background-color', 'rgb(253 237 238)');
		$('#notValidAddress').css('color', '#dc3545');
		return;
	}
		
	}
	
	
	
	if (current_fs.attr('id') == 'fieldset4') {
		
		if (!isEmail($('#clientEmail').val())) {		
			console.log('no e-mail!!!');
			$('#clientEmail').css('border-color', '#dc3545');
			$('#clientEmail').css('background-color', 'rgb(253 237 238)');
			return;
		}
		else if(!document.getElementById('termsCheck').checked ||  !document.getElementById('paymentCheck').checked) {
			console.log('no term check!!!');
			$('#terms-p').css('color', '#dc3545');
			return;
		}
		else {
			submitBuyOrder();
		}
	} 
	
		
	console.log("current_fs.attr('id')=" + current_fs.attr('id'));
	console.log("$(this).parent()=" + $(this).parent());

	//Add Class Active
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

	//show the next fieldset
	next_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
	step: function(now) {
	// for making fielset appear animation
	opacity = 1 - now;

	current_fs.css({
	'display': 'none',
	'position': 'relative'
	});
	next_fs.css({'opacity': opacity});
	},
	duration: 600
	});
	});

	$(".previous").click(function(){

	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();

	//Remove class active
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

	//show the previous fieldset
	previous_fs.show();

	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
	step: function(now) {
	// for making fielset appear animation
	opacity = 1 - now;

	current_fs.css({
	'display': 'none',
	'position': 'relative'
	});
	previous_fs.css({'opacity': opacity});
	},
	duration: 600
	});
	});
	
	$('.image-upload-wrap').bind('dragover', function () {
	    $('.image-upload-wrap').addClass('image-dropping');
	  });
	
	$('.image-upload-wrap').bind('dragleave', function () {
	    $('.image-upload-wrap').removeClass('image-dropping');
	  });
	
	
	//Adjust text size for mobile
	if(screen.width < 600) {
		console.log("screen.width < 600");
		$('.pixelFieldContainer').css( "padding-left", "10px" );
		$('#progressbar').css( "margin-top", "2vh" );
		$('#progressbar li').css( "fontSize", "3vw" );
		$('h4').css({ fontSize : "8vw" , marginTop : "2vh" , marginBottom : "3vh" });
		$('h3').css( "fontSize", "6vw" );
		$('p').css( "fontSize", "3.5vw" );
		$('.indexP').css( "fontSize", "3.5vw" );
		$('.plusMinusSpan').css( "fontSize", "12vw" );
		//$('table span').css( "padding-left", "20px" );
		//$('table span').css( "padding-right", "20px" );
		$('#minusX').css( "margin-right", "50px" );
		$('#plusX').css( "margin-left", "60px" );
		$('.action-btn-img').css( { width : "260px"} );
		$('.buyTextInput').css( {height : "120px", fontSize : "3.5vw"} );
		$('.copy-btn').css( {height : "120px", fontSize : "3.5vw"} );
		$('#orderP').css( {fontSize : "4.5vw"} );
		$('.inputLabel').css( {fontSize : "1.5em"} );
		$('.form-check-label').css( {fontSize : "1.5em", paddingLeft : "30px"} );
		$('.form-check-input').css( {height : "30px", width : "30px"} );
		$('.introModalContent').css( {maxWidth : "90vw", maxHeight : "90vh"} );
		$('#closeIntroModal').css( {width : "130px", height : "130px"} );
		$('#nextIntroModal').css( {height : "200px"} );
		$('#finishIntroModal').css( {height : "200px"} );
		$('#lotteryImgMobile').css( {display : "block"} );
		//$('.form-check-label').css( {padding-left : "30px"} );
		$('.btnRounded').css( {borderRadius : "60px", minWidth : "280px", fontSize: "3rem"} );
		$('.smallMsgDivActBtn').css( {marginTop : "10px", marginBottom : "10px"} );
		$('.smallMsgDivCloseBtn img').css( {height : "50px", width : "50px", margin : "20px"} );
		
//		height: 40px;
//	    width: 40px;
//	    margin: 20px;
		$('.smallMsgDiv').css( {minWidth : "320px", paddingRight : "25px"} );
		
		$('#buyModalCloseBtn').css( {fontSize : "100px"} );
	}
	
	//Adjust text size for mobile
	if(screen.width >= 600) {
		//$('.plMnX').css({height: "40px",  position: "relative",  display: "block!important", top: "-20px"});
		$('#plusY').css({display: "block", height: "20px",  position: "relative",  top: "-20px"});
		$('#minusYTd').css({display: "block",  height: "60px"});
		$('#plusYTd').css({display: "block",  height: "50px"});
		$('#lotteryImgDesktop').css( {display : "block"} );
	}
	
	
});	

function copyToClipboard() {
	  /* Get the text field */
	  var copyText = document.getElementById("officialAddress");

	  /* Select the text field */
	  copyText.select();
	  copyText.setSelectionRange(0, 99999); /* For mobile devices */

	   /* Copy the text inside the text field */
	  navigator.clipboard.writeText(copyText.value);
}

function closeAndEmptyBuyModal() {
	$('#buy').modal('hide');
}
	

function readURL(input) {
		
	  if (input.files && input.files[0]) {

	    var reader = new FileReader();
	    
	    reader.onload = function(e) {
	      $('.image-upload-wrap').hide();

	      $('.file-upload-image').attr('src', e.target.result);
	      console.log("e.target.result" + e.target.result);
	      $('.file-upload-content').show();

	      $('.image-title').html(input.files[0].name);
	    };

	    reader.readAsDataURL(input.files[0]);

	  } else {
	    removeUpload();
	  }
}

function removeUpload() {
$('.file-upload-input').val('');
$('.file-upload-input').replaceWith($('.file-upload-input').clone());
$('.file-upload-content').hide();
$('.image-upload-wrap').show();
}


function clearBuyFormFields(){
	$('#pixelAmount').val('');
	$('#sum').text('');
	$('#clientAddress').val('');
	$('#orderId').text('');
	removeUpload();
	$('#clientEmail').val('');
	$('#clientDiscord').val('');
	$('#clientTwitter').val('');
	$('#clientUrl').val('');
	$('#termsCheck').prop( "checked", false );
	$('#paymentCheck').prop( "checked", false );
}

function generateOrderId() {
    orderId = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 4; i++ ) {
    	orderId += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
    orderId += '-';
    var milis = Date.now().toString();
    orderId += milis.slice(milis.length - 6);
    $('#orderId').text(orderId);
}

function buyOrderSuccessResponseHandler (response) {
	console.log("showing modal time=" + Date.now());
    if(response.status == 'success'){
    	$('#buySuccess').modal('show');
    } else if (response.status == 'error'){
    	$('#buyError').modal('show');
    } else {
    	$('#buyError').modal('show');
    }
    console.log(response.object);
}

function checkCookie() {	
	if($('#show_first_pop')) {
		var showFirstPop = $('#show_first_pop').val();
		console.log('showFirstPop=' + showFirstPop);
		
		if(showFirstPop == '1'){
			$('#lotteryModal').modal('show');
		}
	}
}

function updatePixelField (xE, yE) {
	
	//if(screen.width < 600)
	pixHor += xE;
	pixHor = Math.max(pixHor, 20);
	pixHorReal = pixHor / 2;
	
	pixVert += yE;
	pixVert = Math.max(pixVert, 20);
	pixVertReal = pixVert / 2;
	
	sum = pixHorReal * pixVertReal * rate;
	sum = Math.round((sum + Number.EPSILON) * 1000) / 1000;
	console.log(sum,  pixHorReal , pixVertReal);
	$('#pixelFieldSizeDisplaySpan').text(pixHorReal + 'x' + pixVertReal + ' px');
	$('#pixelFieldSizeDisplayH').text(pixHorReal + 'x' + pixVertReal);
	$('#sum').text(sum);
	$('#sum2').text(sum);
	$('#sum3').text(sum);
	$('#pixelFieldSizeDisplay').width(pixHor).height(pixVert);
	$('.file-upload-image').width(pixHor).height(pixVert);	
}

function updatePixelField2 (xL , yU, xR, yD) {

	pixHorReal = Math.max(xR - xL + 1, 10);
	pixVertReal = Math.max(yD - yU + 1, 10);
	
	pixHor = pixHorReal * 2;
	pixVert = pixVertReal * 2;
	pixHor = Math.max(pixHor, 20);
		
	sum = pixHorReal * pixVertReal * rate;
	sum = Math.round((sum + Number.EPSILON) * 1000) / 1000;
	console.log(sum,  pixHorReal , pixVertReal);
	$('#pixelFieldSizeDisplaySpan').text(pixHorReal + 'x' + pixVertReal + ' px');
	$('#pixelFieldSizeDisplayH').text(pixHorReal + 'x' + pixVertReal);
	$('#selectPx').text(pixHorReal + 'x' + pixVertReal + ' px');
	$('#sum').text(sum);
	$('#sum2').text(sum);
	$('#sum3').text(sum);
	$('#selectedSum').text(sum);
	$('#pixelFieldSizeDisplay').width(pixHor).height(pixVert);
	$('.file-upload-image').width(pixHor).height(pixVert);	
}

function isEmail(email) {
	  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  return regex.test(email);
}

function showBuyModal() {
	clearBuyFormFields();
	pixHor = 40;
	pixVert = 40;
	updatePixelField (0, 0);
	
	previous_fs = current_fs;
	current_fs = $('#fieldset1');
	next_fs = $('#fieldset2');
	
	$('#payment').removeClass('active');
	$('#personal').removeClass('active');
	$('#confirm').removeClass('active');
	
	jQuery('#fieldset1').css('opacity', '1');
	$('#fieldset1').show();
	$('#fieldset2').hide();
	$('#fieldset3').hide();
	$('#fieldset4').hide();

	$('#buy').modal('show');
	console.log(current_fs, next_fs, previous_fs);		
};

function clickIntro() {
	clickedIntro++;
	
	if(clickedIntro == 1) {
		$('#introImg1').css( "display", "none" );
		$('#introImg2').css( "display", "block" );
	} else if(clickedIntro == 2) {
		$('#introImg2').css( "display", "none" );
		$('#introImg3').css( "display", "block" );
	} else if(clickedIntro == 3) {
		$('#introImg3').css( "display", "none" );
		$('#introImg4').css( "display", "block" );
	} else if(clickedIntro == 4) {
		$('#introImg4').css( "display", "none" );
		$('#introImg5').css( "display", "block" );
	} else if(clickedIntro == 5) {
		$('#introImg5').css( "display", "none" );
		$('#introImg6').css( "display", "block" );
		$('#nextIntroModal').css( "display", "none" );
		$('#finishIntroModal').css( "display", "block" );
	} else {
		$('#introModal').modal('hide');
	}
}

function submitBuyOrder() {
	console.log("click submitBuyOrder start time=" + Date.now());
	$('#buy').modal('hide');
	clientEmail = $('#clientEmail').val(); 
	$('#sucClientEmail').text(clientEmail);
	clientDiscord = $('#clientDiscord').val(); 
	clientTwitter = $('#clientTwitter').val(); 
	console.log("clientEmail=" + clientEmail + ", clientDiscord=" + clientDiscord + ", clientTwitter=" + clientTwitter);
	let data = new FormData();
	data.append('orderNr', orderId);
	data.append('email', clientEmail);
	data.append('discord', clientDiscord);
	data.append('twitter', clientTwitter);
	data.append('pixHorizontal', parseInt(pixHorReal));
	data.append('pixVertical', parseInt(pixVertReal));
	data.append('orderSum', sum);
	data.append('clientAddress', clientAddress);
	data.append('picture', orderFile);
	data.append('url', orderUrl);
	if (xR) { data.append('xR', xR); } else {data.append('xR', 0);}
	if (xL) { data.append('xL', xL); } else {data.append('xL', 0);}
	if (yU) { data.append('yU', yU); } else {data.append('yU', 0);}
	if (yD) { data.append('yD', yD); } else {data.append('yD', 0);}
	
	$.ajax({
	    type: "POST",
	    url: 'buy',
	    data: data,
	    contentType: false,
	    processData: false,
	    success: function (response) {
	    	buyOrderSuccessResponseHandler(response);
	    	console.log("success response time=" + Date.now());
	      },
	      error: function (xhr, ajaxOptions, thrownError) {
	    	  $('#buyError').modal('show');
	    	  console.log("error response time=" + Date.now());
	      }
	});
	
	
}
var started = false;
var moved = false;
var displayBuyModal = false;

function touchstarted(e) {
	started = true;
}
function touchmoved(e) {
	moved = true;
}

function imgTouchEnd(e) {
	//alert('started=' + started + 'moved='+ moved);
	if (started && !moved) {
		showBuyModal();
	}
	started = false;
	moved = false;
}

function goToHome() {
	window.location.href="/";

}
	
	
