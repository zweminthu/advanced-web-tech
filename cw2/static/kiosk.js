var vrmHash = {};
$(document).ready(function(){
	$.ajax({
			url:'http://carpark.set09603.napier.ac.uk/anpr.php',
			dataType:'json',
			success:function(d){
				for(var reading of d){
					if (reading.direction === 'Forward')
						if (vrmHash[reading.VRM] === undefined)  
					vrmHash[reading.VRM] = reading;
				}
				$('#vrm').autocomplete({
				source: Object.keys(vrmHash),
				minlength: 1
				})
				console.log(Object.keys(vrmHash));

			},
			error:function(a,b){

			}
		});
	$(function(){
		
	});
})
$(function(){
	
	$('#pay').click(function(){
		
		var vrm = $('#vrm').val();
		

		var reading = vrmHash[vrm];
		if(vrm === ""){
			Swal.fire(
			  "Please, Enter your Vehicle Registration Mark!",
			  "Thanks!"
			  
		
			)

		}
		else if (reading !== undefined) {
			$( '#kamount' ).show( "slow" );
			$('#lipl').hide();
			
			
			$('#licenp').text(vrm);
   			
			var toe = new Date(reading.timeStamp);
			$('#time_of_entry2').text(toe);
			
			var nMinutes = (new Date().getTime() - new Date(reading.timeStamp))/1000/60;
			if(nMinutes>=60){
				var hr = Math.trunc(nMinutes/60);
				var min = Math.trunc(nMinutes%60);

			}
			else{
				var hr = 0;
				var min = Math.trunc(nMinutes);
			}
	
			$('#amount_paid1').text(0);
			$('#kchange').text(0);
			$('#length_of_stay1').text(hr+':'+min);
			
			if (nMinutes<=30){
				var cost = parseInt($('#amount_owed').text(0));
			}
			else if (nMinutes>30 && nMinutes<=60){
				var cost = parseInt($('#amount_owed').text(3.5*100));
			}
			else if (nMinutes>60 && nMinutes<=120){
				var cost = parseInt($('#amount_owed').text(5.5*100));

			}
			else if (nMinutes>120 && nMinutes<=180){
				var cost = parseInt($('#amount_owed').text(8.5*100));

			}
			else{
				var cost = parseInt($('#amount_owed').text(15*100));

			}	
			
			
		getkMoney();
			
		}
		else {
			$('#lipl').hide();
			$('#dtp').fadeIn('slow');
			
			
			}
		
		
		
	});
	$('#prinvoice').click(function(){
		$.ajax({
		url: "/invoice",
		type : "POST",
		data: {
			entry_time: $('#time_of_entry2').text(),
			license_plate: $('#licenp').text(),
			duration: $('#length_of_stay1').text(),
			charges: $('#amount_owed').text(),
			amount_paid: $('#amount_paid1').text(),
			change: $('#kchange').text()
			  },
		success:function(d){
				
		Swal.fire(
			  "Successfully Paid for "+$('#licenp').text()+" !",
			  "Check receipt!",
			  "success"
			  
			)
		}
	});
	});

	$('#print').click(function(){
		$.ajax({
		url: "/invoice",
		type : "POST",
		data: {
			entry_time: $('#time_of_entry1').text(),
			license_plate: $('#licenp1').text(),
			duration: $('#length_of_stay2').text(),
			charges: $('#uamount_owed').text(),
			amount_paid: $('#amount_paid').text(),
			change: $('#uchange').text()
			  },
		success:function(d){
			
		Swal.fire(
			  "Successfully Paid for "+ $('#licenp1').text()+" !",
			  "Check receipt!",
			  "success"
		
			)
		}
	});
	});

	$('#start').click(function(){
  var x = document.getElementById("ent");
  var y = document.getElementById("ki1");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
  } else {
    x.style.display = "none";
    y.style.display = "block";
  }
});

	$('#vrm').click(function() {
  if ( $( ".simple-keyboard" ).is( ":hidden" ) ) {
    $( ".simple-keyboard" ).show( "slow" );
  } else {
    $( ".simple-keyboard" ).slideUp();
  }
});

	
	
})


function vdatetime(val){
	var duration =(new Date().getTime() - new Date(date))/1000/60;
	var date = document.getElementById('datetimepicker4').value;
	$('#time_of_entry').text(date);

	var duration =(new Date().getTime() - new Date(date))/1000/60;
	if(duration>=60){
	var hr = Math.trunc(duration/60);
	var min = Math.trunc(duration%60);

	}
	else{
		var hr = 0;
		var min = Math.trunc(duration);
	}
	
	
	$('#length_of_stay').text(hr+':'+min);
}



function confirm(){
	$('#dtp').fadeOut('slow');
	$('#amount').show('slow');
	var vrm = $('#vrm').val();
	$('#licenp1').text(vrm);

	var date = document.getElementById('datetimepicker4').value;
	$('#time_of_entry1').text(date);

	
	var duration =(new Date().getTime() - new Date(date))/1000/60;
	if(duration>=60){
	var hr = Math.trunc(duration/60);
	var min = Math.trunc(duration%60);

	}
	else{
		var hr = 0;
		var min = Math.trunc(duration);
	}
	
	
	$('#length_of_stay2').text(hr+':'+min);
	
	$('#amount_paid').text(0);
	$('#uchange').text(0);
	if (duration<=30){
			var cost = parseInt($('#uamount_owed').text(0));
		}
		else if (duration>30 && duration<=60){
			var cost = parseInt($('#uamount_owed').text(3.5*100));
		}
		else if (duration>60 && duration<=120){
			var cost = parseInt($('#uamount_owed').text(5.5*100));

		}
		else if (duration>120 && duration<=180){
			var cost = parseInt($('#uamount_owed').text(8.5*100));

		}
		else if (duration>180){
			var cost = parseInt($('#uamount_owed').text(15*100));

		}
		getMoney();	

}


function getMoney(){
	$.ajax({
			url:'http://carpark.set09603.napier.ac.uk/take.php',
			data:{
				carpark:$('#carpark').text()},
				dataType:'json',
			success:function(d){
				if(d!==null){
					var ap = parseInt($('#amount_paid').text());
					ap = ap + d;
					$('#amount_paid').text(ap);
					var ao = parseInt($('#uamount_owed').text());
					if (ap < ao) {
						getMoney();

					}
					else if ( ap >= ao) {
						var change = ap - ao;
						$('#uchange').text(change);
						Swal.fire(
			  				"Thanks for paying!",
			  				"Have a nice day!",
			  				"success"
			  
								)

					}
					
				}
			}
			
		});
}

function getkMoney(){
	$.ajax({
			url:'http://carpark.set09603.napier.ac.uk/take.php',
			data:{
				carpark:$('#carpark').text()},
				dataType:'json',
			success:function(d){
				if(d!==null){
					var ap = parseInt($('#amount_paid1').text());
					ap = ap + d;
					$('#amount_paid1').text(ap);
					var ao = parseInt($('#amount_owed').text());

					if (ap < ao) {
						getkMoney();

					}
					else if ( ap >= ao) {
						var change = ap - ao;
						$('#kchange').text(change);
						Swal.fire(
			  				"Thanks for paying!",
			  				"Have a nice day!",
			  				"success"
			  
								)

					}
									
				}
			}
			
		});
}


function lirep(){
  var x = document.getElementById("amount");
  var y = document.getElementById("rep");
  var z = document.getElementById("ki1");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
    z.style.display = "none";
  } else {
    x.style.display = "none";
    y.style.display = "block";
    z.style.display = "none";
  }
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
$('#cpid').text($('#carpark').text());
$('#udate').text(today);
$('#et').text($('#time_of_entry1').text());
$('#uvrm').text($('#licenp1').text());
$('#du').text($('#length_of_stay2').text());
$('#ao').text($('#uamount_owed').text());
$('#ap').text($('#amount_paid').text());
$('#uch').text($('#uchange').text());



}

function klirep(){
  var x = document.getElementById("kamount");
  var y = document.getElementById("krep");
  var z = document.getElementById("ki1");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
    z.style.display = "none";
  } else {
    x.style.display = "none";
    y.style.display = "block";
    z.style.display = "none";
  }
  var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
$('#kcpid').text($('#carpark').text());
$('#kdate').text(today);
$('#ket').text($('#time_of_entry2').text());
$('#kvrm').text($('#licenp').text());
$('#kdu').text($('#length_of_stay1').text());
$('#kao').text($('#amount_owed').text());
$('#kap').text($('#amount_paid1').text());
$('#kch').text($('#kchange').text());



}