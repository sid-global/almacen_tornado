/* PROYECTO: COR PROCESSU MOBILE */
//var IP = "10.20.99.2"
var IP = "corprocessu.com"
var puerto = "8888"

/* Realiza la validación de los datos del login
 * 20120911 
 */
function redireccionar(url) 
{
	localStorage.regresar = url;
	window.open(url,"_self");
}

/* Abre una nueva ventana en la página de SID
 * 20120613
 */
function sid() {
	window.open("http://www.integradores.net");		
}

/* Limpia las variables del localStorage, y redirecciona al Login
 * 20120613
 */
function salir() {
	localStorage.clear();
	window.open("index.html","_self");	
}

/* Realiza la validación de los datos del login
 * 20121110 
 */
get_sales = function ()
{
	var r;
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/login&callback=?login='+document.getElementById('textinput').value+'&pswd='+hex_md5(document.getElementById('password').value),
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			var html = "";
			if (response.status.id == 'OK') {
				
				if (response.login[0].active == 'Y') {
					redireccionar('index.html\#menu_ppal');
					localStorage.nombre = response.login[0].login;
					localStorage.activo = 'S'; localStorage.c = 'S'; localStorage.p = 'S';
					localStorage.b = 'S'; localStorage.x = ""; localStorage.y = "ALL"; localStorage.be = '';
					localStorage.i = ''; localStorage.r = ''; localStorage.al = ''; localStorage.es = '';
				} else {
					alert("Error! Usuario inactivo.");
				}
			} else {
				alert("Error! " + response.status.message + '.');
			}
		}	
	});
}

/********************************************************************************************************************************************/
/***                                                     PANTALLAS INVENTARIO INICIAL                                                     ***/
/********************************************************************************************************************************************/
/* Función auxiliar que inicializa las variables necesarias para realizar una consulta 
 * filtrada por un rango de fechas
 */
function PreConsultaRecepcion(arg){
	localStorage.FI="";
	localStorage.FF="";
	localStorage.cod="";
	localStorage.t="";
	localStorage.es = ''; 
	localStorage.i = '';
	localStorage.r = '';
	localStorage.alm = '';
	localStorage.be = '';
	redireccionar(arg);
}

/* Consulta los Inventarios Iniciales dependiendo del Filtro indicado por el usuario
 * 201209112
 */
function CInventario(){
	$('#FI').val(localStorage.FI);
	$('#FF').val(localStorage.FF);
	id = ""; resp = ""; alm = ""; estatus = "";
	var url = "";
	if(localStorage.es != "") {
		if (localStorage.FI == "") {
			localStorage.FI = '2000-01-01';	
		}
		if(localStorage.FF != "") {
			fin=localStorage.FF;
		} else {
			d = new Date();
			mes = d.getMonth()+1;
			fin = d.getFullYear()+"-"+mes+"-"+d.getDate();
		}
		url = 'http://'+IP+':'+puerto+'/consulta&callback=?tipoc=3&fi='+localStorage.FI+'&ff='+fin
		if (localStorage.i != "") {url += '&id='+localStorage.i.toUpperCase()} //ID de la operacion
		if (localStorage.r != "") {url += '&resp='+localStorage.r}	// Sec de Responsable
		if (localStorage.al != "") {url += '&alm='+localStorage.al} // Sec de Almacen
		if (localStorage.es != "") {url += '&est='+localStorage.es} else {url += '&est=IC'} //Estatus
		
		jQuery.ajax({
			url:url,
			dataType: 'jsonp',
			crossDomain: true,
			cache: false, 
			success: function(response) {
				var html = "";
				html = "";
				var est = '';
				for (i = 0; i < response.material.length; i++) {
					if (response.material[i].cor_movimiento_estatus == 'IC') { 
						est = "Procesado";
					} else {
						est = "Sin Procesar"
					}
					html+='<li><a onClick="Consulta('+response.material[i].cor_movimiento_sec+')"><h3>'+response.material[i].cor_movimiento_id+'</h3><p>Responsable: '+response.material[i].cor_responsable_nombre+'; Almacén: '+response.material[i].cor_almacen_id+'</p><p>Fecha: '+response.material[i].cor_movimiento_fecha+'; Estatus: '+est+'</p></a></li>';
				}
				html='<ul data-role="listview" data-inset="true" id="ConsultaRec"><li data-role="list-divider" role="heading"><h3>Inventarios Iniciales: '+response.material.length+'</h3></li>'+html+'</ul>';
				$(html).appendTo('#Recep');
				// Se cargan los datos de los campos de búsqueda avanzada que lo requieren
				var html1='<label for="textinput2">Identificador:</label><input type="text" name="textinput2" id="textinput2" maxlength="32"/>';
				// Se cargan los datos del combo responsable
				jQuery.ajax({
					url:'http://'+IP+':'+puerto+'/responsable?tipoc=1&activo=S',
					dataType: 'jsonp',
					crossDomain: true,
					cache: false, 
					success: function(response) {
						html1+='<label for="resp">Responsable:</label><select data-theme="b" name="resp" id="resp" data-theme="b"><option value="">Seleccione</option>';
						for (i = 0; i < response.material.length; i++) {
							html1+='<option value="'+response.material[i].cor_responsable_sec+'">'+response.material[i].cor_responsable_nombre+'</option>';
						}
						html1+='</select>';
						// Se cargan los datos del combo almacen
						jQuery.ajax({
							url:'http://'+IP+':'+puerto+'/almacen?tipoc=1&activo=S',
							dataType: 'jsonp',
							crossDomain: true,
							cache: false, 
							success: function(response) {
								html1+='<label for="alm">Almacén:</label><select data-theme="b" name="alm" id="alm" data-theme="b"><option value="">Seleccione</option>';
								for (i = 0; i < response.material.length; i++) {
									html1+='<option value="'+response.material[i].cor_almacen_sec+'">'+response.material[i].cor_almacen_id+'</option>';
								}
								html1+='</select><fieldset data-role="controlgroup" data-type="vertical"><legend>Estatus:</legend><input type="radio" name="radio1" id="radio1_0" value="IC"  checked/><label for="radio1_0">Procesado</label><input type="radio" name="radio1" id="radio1_1" value="IA"/><label for="radio1_1">Sin Procesar</label></fieldset>';
								$(html1).appendTo('#busq');
								redireccionar("CInventario.html\#CRecepcion");
							}	
						});
					}	
				});
			}	
		});
	} else {
		var html = "";
		// Por defecto se consultan todos los inventarios iniciales regisrados en BD
		jQuery.ajax({
			url:'http://'+IP+':'+puerto+'/consulta&callback=?tipoc=3',
			dataType: 'jsonp',
			crossDomain: true,
			cache: false, 
			success: function(response) {
				html = "";
				var est = '';
				for (i = 0; i < response.material.length; i++) {
					if (response.material[i].cor_movimiento_estatus == 'IC') { 
						est = "Procesado";
					} else {
						est = "Sin Procesar"
					}
					html+='<li><a onClick="Consulta('+response.material[i].cor_movimiento_sec+')"><h3>'+response.material[i].cor_movimiento_id+'</h3><p>Responsable: '+response.material[i].cor_responsable_nombre+'; Almacén: '+response.material[i].cor_almacen_id+'</p><p>Fecha: '+response.material[i].cor_movimiento_fecha+'; Estatus: '+est+'</p></a></li>';
				}
				html='<ul data-role="listview" data-inset="true" id="ConsultaRec"><li data-role="list-divider" role="heading"><h3>Inventarios Iniciales: '+response.material.length+'</h3></li>'+html+'</ul>';
				$(html).appendTo('#Recep');
				
				// Se cargan los datos de los campos de búsqueda avanzada que lo requieren
				var html1='<label for="textinput2">Identificador:</label><input type="text" name="textinput2" id="textinput2" maxlength="32"/>';
				// Se cargan los datos del combo responsable
				jQuery.ajax({
					url:'http://'+IP+':'+puerto+'/responsable?tipoc=1&activo=S',
					dataType: 'jsonp',
					crossDomain: true,
					cache: false, 
					success: function(response) {
						html1+='<label for="resp">Responsable:</label><select data-theme="b" name="resp" id="resp" data-theme="b"><option value="">Seleccione</option>';
						for (i = 0; i < response.material.length; i++) {
							html1+='<option value="'+response.material[i].cor_responsable_sec+'">'+response.material[i].cor_responsable_nombre+'</option>';
						}
						html1+='</select>';
						// Se cargan los datos del combo almacen
						jQuery.ajax({
							url:'http://'+IP+':'+puerto+'/almacen?tipoc=1&activo=S',
							dataType: 'jsonp',
							crossDomain: true,
							cache: false, 
							success: function(response) {
								html1+='<label for="alm">Almacén:</label><select data-theme="b" name="alm" id="alm" data-theme="b"><option value="">Seleccione</option>';
								for (i = 0; i < response.material.length; i++) {
									html1+='<option value="'+response.material[i].cor_almacen_sec+'">'+response.material[i].cor_almacen_id+'</option>';
								}
								html1+='</select><fieldset data-role="controlgroup" data-type="vertical"><legend>Estatus:</legend><input type="radio" name="radio1" id="radio1_0" value="IC"  checked/><label for="radio1_0">Procesado</label><input type="radio" name="radio1" id="radio1_1" value="IA"/><label for="radio1_1">Sin Procesar</label></fieldset>';
								$(html1).appendTo('#busq');
								redireccionar("CInventario.html\#CRecepcion");
							}	
						});
					}	
				});
			}	
		});
	}
}

//Función que almacena los valores de las fechas a utilizar en el flitro de la busqueda
function GuardarFecha(arg,arg1){
	
	localStorage.FI=document.getElementById('FI').value;
	localStorage.FF=document.getElementById('FF').value;
	if (arg1 == 1) { //Inventario Inicial
		localStorage.i = document.getElementById('textinput2').value;
		select = document.getElementById("resp").options;
		index = document.getElementById("resp").selectedIndex;
		localStorage.r = select[index].value;
		select = document.getElementById("alm").options;
		index = document.getElementById("alm").selectedIndex;
		localStorage.al = select[index].value;
		if(document.getElementById("radio1_0").checked){localStorage.es ="IC";} else {localStorage.es ="IA";}
	} else if (arg1 == 2) { //Codificacion
		localStorage.i = document.getElementById('textinput2').value;
		select = document.getElementById("resp").options;
		index = document.getElementById("resp").selectedIndex;
		localStorage.r = select[index].value;
		if(document.getElementById("radio1_0").checked){localStorage.es ="CA";} else {localStorage.es ="CC";}
	} else if (arg1 == 3) { //Despacho
		localStorage.i = document.getElementById('textinput2').value;
		select = document.getElementById("resp").options;
		index = document.getElementById("resp").selectedIndex;
		localStorage.r = select[index].value;
		select = document.getElementById("alm").options;
		index = document.getElementById("alm").selectedIndex;
		localStorage.al = select[index].value;
		select = document.getElementById("benef").options;
		index = document.getElementById("benef").selectedIndex;
		localStorage.be = select[index].value;
		//if(document.getElementById("radio1_0").checked){localStorage.es ="A";} else {localStorage.es ="C";}
	} else if (arg1 == 4) { //Inventario Almacen
		localStorage.i = document.getElementById('textinput2').value;
		select = document.getElementById("resp").options;
		index = document.getElementById("resp").selectedIndex;
		localStorage.r = select[index].value;
		select = document.getElementById("alm").options;
		index = document.getElementById("alm").selectedIndex;
		localStorage.al = select[index].value;
		//if(document.getElementById("radio1_0").checked){localStorage.es ="A";} else {localStorage.es ="C";}
	} else if (arg1 == 5) { //Traslado
		localStorage.i = document.getElementById('textinput2').value;
		select = document.getElementById("resp").options;
		index = document.getElementById("resp").selectedIndex;
		localStorage.r = select[index].value;
		select = document.getElementById("alm").options;
		index = document.getElementById("alm").selectedIndex;
		localStorage.al = select[index].value;
		//if(document.getElementById("radio1_0").checked){localStorage.es ="A";} else {localStorage.es ="C";}
	}
	redireccionar(arg);
}

/* Inicializa las variables necesarias para ingresar un nuevo Inventario Inicial
 * 201209112
 */
function PreIngresarInvInicial(){	
	localStorage.mov="";
	localStorage.matcat="";
	localStorage.almacen="";
	localStorage.monto="";
	redireccionar('InventarioInicial.html');
}

/* Carga los datos de necesarios para crear un Inventario Inicial
 * 201209112
 */
function PreIngresarRecepInv(){
	d = new Date();
	mes = d.getMonth() + 1;
	fecha_actual = d.getFullYear() + '-' +  mes + '-' + d.getDate();
	if(localStorage.mov==""){	
		html='<div data-role="fieldcontain"><label for="textinput2">Identificador:</label><input type="text" name="textinput2" id="textinput2" value="" maxlength="32"/> </div>';
		html+='<div data-role="fieldcontain"><label for="textarea">Descripción:</label><textarea cols="40" rows="8" name="textarea" id="textarea" onKeyUp="return maximaLongitud(this,100)"></textarea></div>';
		html+='<div data-role="fieldcontain"><label for="FI">Fecha:</label><input type="text" name="FI" id="FI" placeholder="yyyy-mm-dd" value="'+fecha_actual+'" maxlength="10"/></div>';
		
		// Se cargan los datos del combo responsable
		jQuery.ajax({
			url:'http://'+IP+':'+puerto+'/responsable?tipoc=1&activo=S',
			dataType: 'jsonp',
			crossDomain: true,
			cache: false, 
			success: function(response) {
				html+='<label for="resp">Responsable:</label><select data-theme="b" name="resp" id="resp" data-theme="b"><option value="">Seleccione</option>';
				for (i = 0; i < response.material.length; i++) {
					html+='<option value="'+response.material[i].cor_responsable_sec+'">'+response.material[i].cor_responsable_nombre+'</option>';
				}
				html+='</select>';
				// Se cargan los datos del combo almacen
				jQuery.ajax({
					url:'http://'+IP+':'+puerto+'/almacen?tipoc=1&activo=S',
					dataType: 'jsonp',
					crossDomain: true,
					cache: false, 
					success: function(response) {
						html+='<label for="alm">Almacén:</label><select data-theme="b" name="alm" id="alm" data-theme="b"><option value="">Seleccione</option>';
						for (i = 0; i < response.material.length; i++) {
							html+='<option value="'+response.material[i].cor_almacen_sec+'">'+response.material[i].cor_almacen_id+'</option>';
						}
						html+='</select>';
						html+='<button data-theme="b" onClick="IngresarInvInicial()">Crear Inventario Inicial</button>';
						$(html).appendTo('#DRecepcion');
						redireccionar("InventarioInicial.html\#NewRecep");
					}	
				});
			}	
		});
	}
}

function IngresarInvInicial(){
	select = document.getElementById("resp").options;
	index = document.getElementById("resp").selectedIndex;
	resp=select[index].value;
	select = document.getElementById("alm").options;
	index = document.getElementById("alm").selectedIndex;
	alm=select[index].value;
	id=document.getElementById("textinput2").value.toUpperCase();
	desc=document.getElementById("textarea").value.toUpperCase();
	fecha=document.getElementById("FI").value;
	
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/movlote&callback=?tipoc=1&id='+id+'&desc='+desc+'&fec='+fecha+'&resp='+resp+'&user='+localStorage.nombre+'&alm='+alm,
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			redireccionar('CInventario.html');
		}	
	});
}

function Consulta(sec) {
	localStorage.Inv=sec;
	localStorage.mov=sec;
	redireccionar("CInventarioE.html");
}

/* Carga los datos de la pantalla de Consulta de un Inventario Inicial
 * 2012-09-13
 */
function ConsultaInv(){
	var estatus = '';
	var est = '';
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/movlote&callback=?tipoc=2&sec='+localStorage.Inv,
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			var html = "";
			for (i = 0; i < response.material.length; i++) {
				estatus = response.material[i].cor_movimiento_estatus;
				if (estatus == 'IA') {
					est = "Sin Procesar";
				} else if (estatus == 'IC') {
					est = "Procesado";
				}
				html+='<div data-role="fieldcontain"><label for="textinput2">Inventario Inicial:</label><input type="text" name="textinput2" id="textinput2" value="'+response.material[i].cor_movimiento_id+'" readonly  /> </div>';
				html+='<div data-role="fieldcontain"><label for="textinput6">Estatus:</label><input type="text" name="textinput6" id="textinput6" value="'+est+'"  readonly/></div>';
				html+='<div data-role="fieldcontain"><label for="textinput5">Responsable:</label><input type="text" name="textinput5" id="textinput5" value="'+response.material[i].cor_responsable_nombre+'" readonly /></div>';
				html+='<div data-role="fieldcontain"><label for="textinput4">Almacén:</label><input type="text" name="textinput4" id="textinput4" value="'+response.material[i].cor_almacen_id+'" readonly /></div>';
				if (estatus == 'IA'){			
					html+='<div align="center" data-role="controlgroup" data-type="horizontal"><button button data-inline="true" data-theme="b" onClick="redireccionar(\'NewInv.html\')">Continuar Inventario</button><button button data-inline="true" data-theme="b" onClick="CerrarInv()">Cerrar Inventario</button></div>';
				}
				
			}
			jQuery.ajax({
				url:'http://'+IP+':'+puerto+'/movlote&callback=?tipoc=3&sec='+localStorage.Inv,
				dataType: 'jsonp',
				crossDomain: true,
				cache: false, 
				success: function(response) {
					nro=0;
					items = 0;
					html2 = '';
					for (i = 0; i < response.material.length; i++) {
						nro+=1;
						html2+='<li><h3>'+response.material[i].cor_matcat_id+'</h3><p>Cantidad: '+response.material[i].cor_movlote_cantidad+'</p></li>';
						items+=parseInt(response.material[i].cor_movlote_cantidad);
					}
					
					html2='<ul data-role="listview" data-inset="true" id="ConsultaRec"><li data-role="list-divider" role="heading">Nro. de Materiales Registrados: '+nro+'; Nro. de Items Registrados: '+items+'</li>'+html2+'</ul>';
					html+=html2;
					$(html).appendTo('#CRecep');
					redireccionar("CInventarioE.html\#CRecepcionE");
				}	
			});
		}	
	});
}

/* Carga los datos de la pantalla que almacena los items de un Inventario Inicial
 * 2012-09-13
 */
function PreIngresarInvDetalle(){
	if(localStorage.mov==""){
			redireccionar("NewInv.html\#NewRecep");
	}else{
		jQuery.ajax({
			url:'http://'+IP+':'+puerto+'/materiales?tipoc=1&activo=S',
			dataType: 'jsonp',
			crossDomain: true,
			cache: false, 
			success: function(response) {
				html = "";
				html+='<label for="mat">Material:</label><select name="mat" id="mat" data-theme="b"><option value="">Seleccione</option>';
				for (i = 0; i < response.material.length; i++) {
					html+='<option value="'+response.material[i].cor_matcat_sec+'">'+response.material[i].cor_matcat_id+'</option>';
				}
				html+='</select>';
				html+='<label for="cant">Cantidad:</label><input type="number" name="cant" id="cant" value="0" />';	
				html+='<button data-theme="b" onClick="GuardarMaterial()">Procesar Item</button>';
				$(html).appendTo('#DRecep');
				redireccionar("NewInv.html\#NewRecep");
			}	
		});
	}
}

/* Guarda en BD los items de un Inventario Inicial
 * 2012-09-13
 */
function GuardarMaterial() {
	select=document.getElementById("mat").options;
	index=document.getElementById("mat").selectedIndex;
	material=select[index].value;
	cantidad = document.getElementById("cant").value;
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/movlote&callback=?tipoc=4&sec='+localStorage.Inv+'&id='+material+'&desc='+cantidad+'&user='+localStorage.nombre,
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			redireccionar("NewInv.html");
		}	
	});
}

/* Actualiza el estatus de un Inventario Inicial a Procesado
 * 2012-09-13
 */
function CerrarInv(){
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/movlote&callback=?tipoc=5&sec='+localStorage.Inv+'&user='+localStorage.nombre+'&est=IC',
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			redireccionar("CInventario.html");
		}	
	});
}

function CCodificacion(){
	var url = 'http://'+IP+':'+puerto+'/movlote&callback=?tipoc=6'
	$('#FI').val(localStorage.FI);
	$('#FF').val(localStorage.FF);
	var fin; var estatus; var id; var resp;
	if(localStorage.es != ""){
		if (localStorage.FI == "") {
			localStorage.FI = '2000-01-01';	
		}
		if(localStorage.FF != ""){
			fin=localStorage.FF;
		}else{
			d = new Date();
			mes = d.getMonth()+1;
			fin = d.getFullYear()+"-"+mes+"-"+d.getDate();
		}
		url += '&fi='+localStorage.FI+'&ff='+localStorage.FF
		if (localStorage.i != "") {url += '&id='+localStorage.i.toUpperCase()} // ID de la Operacion
		if (localStorage.r != "") {url += '&resp='+localStorage.r} // Sec del Responsable
		if (localStorage.es != "") {url += '&est='+localStorage.es} // Estatus
		//Servicio que busca los datos de las recepciones que cumplen el rango de fechas
		jQuery.ajax({
			url:url,
			dataType: 'jsonp',
			crossDomain: true,
			cache: false, 
			success: function(response) {
				html = "";
				for (i = 0; i < response.material.length; i++) {
					html+='<li><a onClick="ConsultaC('+response.material[i].cor_movimiento_sec+')"><h3>'+response.material[i].cor_movimiento_id+'</h3><p>Responsable: '+response.material[i].cor_responsable_nombre+'; Fecha: '+response.material[i].cor_movimiento_fecha+'</p></a></li>';
				}
				html='<ul data-role="listview" data-inset="true" id="ConsultaCod"><li data-role="list-divider" role="heading"><h3>Codificaciones: '+response.material.length+'</h3></li>'+html+'</ul>';
				$(html).appendTo('#Codif');
				// Se cargan los datos de los campos de búsqueda avanzada que lo requieren
				html1='<label for="textinput2">Identificador:</label><input type="text" name="textinput2" id="textinput2" maxlength="32"/>';
				jQuery.ajax({
					url:'http://'+IP+':'+puerto+'/responsable?tipoc=1&activo=S',
					dataType: 'jsonp',
					crossDomain: true,
					cache: false, 
					success: function(response) {
						html1+='<label for="resp">Responsable:</label><select data-theme="b" name="resp" id="resp" data-theme="b"><option value="">Seleccione</option>';
						for (i = 0; i < response.material.length; i++) {
							if (localStorage.r == response.material[i].cor_responsable_sec) {
								html1+='<option value="'+response.material[i].cor_responsable_sec+'" selected>'+response.material[i].cor_responsable_nombre+'</option>';
							} else {
								html1+='<option value="'+response.material[i].cor_responsable_sec+'">'+response.material[i].cor_responsable_nombre+'</option>';	
							}
						}
						if (localStorage.es == 'CA') {
							html1+='</select><fieldset data-role="controlgroup" data-type="vertical"><legend>Estatus:</legend><input type="radio" name="radio1" id="radio1_0" value="CA" checked/><label for="radio1_0">Abierto</label><input type="radio" name="radio1" id="radio1_1" value="CC"/><label for="radio1_1">Cerrado</label></fieldset>';
						} else {
							html1+='</select><fieldset data-role="controlgroup" data-type="vertical"><legend>Estatus:</legend><input type="radio" name="radio1" id="radio1_0" value="CA"/><label for="radio1_0">Abierto</label><input type="radio" name="radio1" id="radio1_1" value="CC" checked/><label for="radio1_1">Cerrado</label></fieldset>';
						}
						$(html1).appendTo('#busq');
						redireccionar("CCodificacion.html\#CCodificacion");
					}	
				});
			}	
		});
	}else{		
		jQuery.ajax({
			url:'http://'+IP+':'+puerto+'/movlote&callback=?tipoc=6&est=CA',
			dataType: 'jsonp',
			crossDomain: true,
			cache: false, 
			success: function(response) {
				html = "";
				for (i = 0; i < response.material.length; i++) {
					html+='<li><a onClick="ConsultaC('+response.material[i].cor_movimiento_sec+')"><h3>'+response.material[i].cor_movimiento_id+'</h3><p>Responsable: '+response.material[i].cor_responsable_nombre+'; Fecha: '+response.material[i].cor_movimiento_fecha+'</p></a></li>';
				}
				html='<ul data-role="listview" data-inset="true" id="ConsultaCod"><li data-role="list-divider" role="heading"><h3>Codificaciones: '+response.material.length+'</h3></li>'+html+'</ul>';
				$(html).appendTo('#Codif');
				// Se cargan los datos de los campos de búsqueda avanzada que lo requieren
				html1='<label for="textinput2">Identificador:</label><input type="text" name="textinput2" id="textinput2" maxlength="32"/>';
				jQuery.ajax({
					url:'http://'+IP+':'+puerto+'/responsable?tipoc=1&activo=S',
					dataType: 'jsonp',
					crossDomain: true,
					cache: false, 
					success: function(response) {
						html1+='<label for="resp">Responsable:</label><select data-theme="b" name="resp" id="resp" data-theme="b"><option value="">Seleccione</option>';
						for (i = 0; i < response.material.length; i++) {
							html1+='<option value="'+response.material[i].cor_responsable_sec+'">'+response.material[i].cor_responsable_nombre+'</option>';
						}
						html1+='</select><fieldset data-role="controlgroup" data-type="vertical"><legend>Estatus:</legend><input type="radio" name="radio1" id="radio1_0" value="CA"  checked/><label for="radio1_0">Abierto</label><input type="radio" name="radio1" id="radio1_1" value="CC"/><label for="radio1_1">Cerrado</label></fieldset>';
						$(html1).appendTo('#busq');
						redireccionar("CCodificacion.html\#CCodificacion");
					}	
				});
			}	
		});
	}
}

//Función que genera la pantalla para ingresar una nueva codificación
function PreCod(){
	d = new Date();
	mes = d.getMonth() + 1;
	fecha_actual = d.getFullYear() + '-' +  mes + '-' + d.getDate();
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/responsable?tipoc=1&activo=S',
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			html='<div data-role="fieldcontain"><label for="id">Identificador:</label><input type="text" name="id" id="id" maxlength="32"/></div>';
			html+='<div data-role="fieldcontain"><label for="desc">Descripción:</label><textarea cols="40" rows="8" name="desc" id="desc" onKeyUp="return maximaLongitud(this,100)"></textarea></div>';
			html+='<div data-role="fieldcontain"><label for="fecha">Fecha:</label><input type="text" name="fecha" id="fecha" placeholder="yyyy-mm-dd" value="'+fecha_actual+'" maxlength="10"/></div>';
			html+='<div data-role="fieldcontain"><label for="textinput5">Responsable:</label><select data-theme="b" name="textinput5" id="textinput5" data-theme="b"> <option value="">Seleccione</option>';
			
			for (i = 0; i < response.material.length; i++) {
				html+='<option value="'+response.material[i].cor_responsable_sec+'">'+response.material[i].cor_responsable_nombre+'</option>';
			}
			html+='</select></div>';
			html+='<button data-inset="true" data-theme="b" onClick="MenuCodif()">Crear Codificación</button>';
			$(html).appendTo('#Cod');
			redireccionar("PreCod.html\#PreCod");
		}	
	});
}


//Función que inicializa todos los datos necesarios y crea el encabezado de una codificación
function MenuCodif(){
	localStorage.matcat="";
	localStorage.almacen="";
	localStorage.mov="";
	id=document.getElementById("id").value.toUpperCase();
	desc=document.getElementById("desc").value.toUpperCase();
	fecha=document.getElementById("fecha").value;
	select = document.getElementById("textinput5").options;
	index = document.getElementById("textinput5").selectedIndex;
	resp=select[index].value;

	if(id!="" && fecha!="" && resp!=""){
		//Servicio que genera el encabezado de una codificación
		jQuery.ajax({
			url:'http://'+IP+':'+puerto+'/movlote&callback=?tipoc=7&id='+id+'&desc='+desc+'&fec='+fecha+'&resp='+resp+'&user='+localStorage.nombre,
			dataType: 'jsonp',
			crossDomain: true,
			cache: false, 
			success: function(response) {
				redireccionar('CCodificacion.html');
			}	
		});
	}else{
		alert("Error! Los campos Identificador, Fecha, y Responsable son obligatorios.");
	}
}

function ConsultaC(sec){
	localStorage.Codif=sec;
	redireccionar("CCodificacionE.html");
}


//Función que genera la pantalla de consultar una recepción seleccionada
function ConsultaCodificacion(){
	//Servicio que busca los datos de la codificación seleccionada
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/movlote?tipoc=8&sec='+localStorage.Codif,
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			html = "";
			html2 = '';
			for (i = 0; i < response.material.length; i++) {
				html+='<div data-role="fieldcontain"><label for="textinput2">Identificador:</label><input type="text" name="textinput2" id="textinput2" value="'+response.material[i].cor_movimiento_id+'" readonly  /> </div>';
				html+='<div data-role="fieldcontain"><label for="textarea">Descripción:</label><textarea cols="40" rows="8" name="textarea" id="textarea" readonly>'+response.material[i].cor_movimiento_desc+'</textarea></div>';
				html+='<div data-role="fieldcontain"><label for="textinput7">Fecha:</label><input type="text" name="textinput7" id="textinput7" value="'+response.material[i].cor_movimiento_fecha+'" readonly /> </div>';
				html+='<div data-role="fieldcontain"><label for="textinput5">Responsable:</label><input type="text" name="textinput5" id="textinput5" value="'+response.material[i].cor_responsable_nombre+'" readonly /></div>';
				if (response.material[i].sum == null) {
					html+='<div data-role="fieldcontain"><label for="textinput">Nro. de items:</label><input type="text" name="textinput" id="textinput" value="0" readonly /></div>';
				} else {
					html+='<div data-role="fieldcontain"><label for="textinput">Nro. de items:</label><input type="text" name="textinput" id="textinput" value="'+response.material[i].sum+'" readonly /></div>';	
				}
				localStorage.mov=localStorage.Codif;
				
			}
			html+='</ul></div>';
			html+='<div align="center" data-role="controlgroup" data-type="horizontal"><button data-theme="b" onClick="redireccionar(\'Codificacion.html\')">Continuar Codificación</button><button button data-inline="true" data-theme="b" onClick="CerrarCod()">Cerrar Codificación</button></div>';

			$(html).appendTo('#CCodif');
			redireccionar("CCodificacionE.html\#CCodificacionE");
		}	
	});
}


/* Obtiene la lista de las comosiciones registradas en el sistema
 * 2012-09-17 MT
 */
function ConsultaComp(){
	//Servicio que busca las composiciones
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/composicion?tipoc=1&activo=S',
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			html='<ul data-role="listview" data-inset="true" id="ConsultaCod">';
			html2 = '';
			for (i = 0; i < response.material.length; i++) {
				html2+='<li><a onClick="ConsultarComposicion('+response.material[i].cor_composicion_sec+')"><h3>'+response.material[i].cor_composicion_id+'</h3></a></li>';
			}
			html+='<li data-role="list-divider" role="heading"><h3>Composiciones: '+response.material.length+'</h3></li>'+html2+'</ul>';
			$(html).appendTo("#ConsultaComp");
			redireccionar("ConsultaComp.html\#consulta_comp");
		}	
	});
}

//Función auxiliar que almacena el valor del material seleccionado y recarga la pantalla
function ActDatos(){
	select = document.getElementById("matcat").options;
	index = document.getElementById("matcat").selectedIndex;
	localStorage.matcat=select[index].value;
}

//Función que genera la pantalla que realiza las codificaciones
function PreCodificacion(){
	// Se obtienen los materiales disponibles para codificar
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/movlote?tipoc=9',
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			html='<div data-role="fieldcontain"><label for="matcat">Material a Codificar:</label><select data-theme="b" name="matcat" id="matcat" onChange="ActDatos()" > <option value="">Seleccione</option>';
			for (i = 0; i < response.material.length; i++) {
				if (response.material[i].sum  > 0) {
					html+='<option value="'+response.material[i].cor_matcat_sec+'">'+response.material[i].cor_matcat_id+' ('+response.material[i].sum+')</option>';
				}
			}
			// Se obtienen la lista de almacenes destino
			jQuery.ajax({
				url:'http://'+IP+':'+puerto+'/almacen?tipoc=1&activo=S',
				dataType: 'jsonp',
				crossDomain: true,
				cache: false, 
				success: function(response) {
					almacen='<div data-role="fieldcontain"><label for="almacen">Almacén Destino:</label><select data-theme="b" name="almacen" id="almacen" onChange="ActAlm()"> <option value="">Seleccione</option>';
					for (i = 0; i < response.material.length; i++) {
						almacen+='<option value="'+response.material[i].cor_almacen_sec+'">'+response.material[i].cor_almacen_id+'</option>';
					}
					// Se obtienen los detalles de la codificacion
					jQuery.ajax({
						url:'http://'+IP+':'+puerto+'/movlote?tipoc=10&sec='+localStorage.mov,
						dataType: 'jsonp',
						crossDomain: true,
						cache: false, 
						success: function(response) {
							nro = 0;
							items = 0;
							lista = '<div data-role="fieldcontain"><label for="CI">Código Inicial:</label><input type="number" name="CI" id="CI" value="" min="0"/></div>';
							lista += '<div data-role="fieldcontain"><label for="CF">Cantidad:</label><input type="number" name="CF" id="CF" value="" min="1"/></div>';
							lista += '<button data-theme="b" onClick="GenerarCod()">Procesar Códigos</button><br/><ul data-role="listview" data-inset="true">';
							lista2 = '';
							for (i = 0; i < response.material.length; i++) {
								lista2+='<li><h3>'+response.material[i].cor_matcat_id+'</h3><p>Nro. de items codificados: '+response.material[i].cor_movlote_cantidad+'</p></li>';
								items+=parseInt(response.material[i].cor_movlote_cantidad);
								nro+=1;
							}
							// Se obtienen los colores activos
							jQuery.ajax({
								url:'http://'+IP+':'+puerto+'/color?tipoc=1&activo=S',
								dataType: 'jsonp',
								crossDomain: true,
								cache: false, 
								success: function(response) {
									color='<div data-role="fieldcontain"><label for="color">Color:</label><select data-theme="b" name="color" id="color" onChange="ActColor()"><option value="">Seleccione</option>';
									for (i = 0; i < response.material.length; i++) {
										color+='<option value="'+response.material[i].cor_color_sec+'">'+response.material[i].cor_color_id+'</option>';
									}
									// Se obtienen las materias primas
									jQuery.ajax({
										url:'http://'+IP+':'+puerto+'/materiaprima?tipoc=1&activo=S',
										dataType: 'jsonp',
										crossDomain: true,
										cache: false, 
										success: function(response) {
											materiap='<div data-role="fieldcontain"><label for="matp">Materia Prima:</label><select data-theme="b" name="matp" id="matp" onChange="ActMatP()"><option value="">Seleccione</option>';
											for (i = 0; i < response.material.length; i++) {
												materiap+='<option value="'+response.material[i].cor_matprima_sec+'">'+response.material[i].cor_matprima_id+'</option>';
											}
											materiap+='</select></div>';
											color+='</select></div>';
											lista+='<li data-role="list-divider" role="heading" data-theme="b">Materiales Codificados: '+nro+'; Nro. de artículos codificados: '+items+'</li>' + lista2 + '</ul>';
											almacen+='</select></div>';
											html+='</select></div> ' + almacen + ' ' + color + ' ' + materiap + ' ' + lista;
											$(html).appendTo('#cod');
											redireccionar("Codificacion.html\#Cod");
										}	
									});
								}	
							});
						}	
					});
				}	
			});
		}	
	});
}

//Función auxiliar que guarda el valor del almacen seleccionado 
function ActAlm(){
	select = document.getElementById("almacen").options;
	index = document.getElementById("almacen").selectedIndex;
	localStorage.almacen=select[index].value;
	
}

//Función auxiliar que guarda el valor del color seleccionado 
function ActColor(){
	select = document.getElementById("color").options;
	index = document.getElementById("color").selectedIndex;
	localStorage.color=select[index].value;	
}

//Función auxiliar que guarda el valor de la materia prima seleccionado 
function ActMatP(){
	select = document.getElementById("matp").options;
	index = document.getElementById("matp").selectedIndex;
	localStorage.matp=select[index].value;	
}

//Función que Genera los articulos de una codificación 
function GenerarCod(){
	CI=document.getElementById("CI").value;
	Cantidad=document.getElementById("CF").value;
	select = document.getElementById("almacen").options;
	index = document.getElementById("almacen").selectedIndex;
	almacen=select[index].value;
	select = document.getElementById("matcat").options;
	index = document.getElementById("matcat").selectedIndex;
	matcat=select[index].value;
	// Se Verifica que los codigo no se encuentren registrados
	
	if (CI == "" || almacen == "" || matcat == "" || Cantidad == "") {
		alert("Error! Los campos Material a Codificar, Almacén Destino, Código Inicial, y Cantidad son obligatorios.");
	} else {
		CI = parseInt(document.getElementById("CI").value);
		CF = CI + parseInt(document.getElementById("CF").value) - 1;
		dif = CF - CI + 1;
		
		jQuery.ajax({
			url:'http://'+IP+':'+puerto+'/verificaciones?tipoc=1&ci='+CI+'&cf='+CF,
			dataType: 'jsonp',
			crossDomain: true,
			cache: false, 
			success: function(response) {
				var error = '';
				if (response.status.id == 'ERROR') {
					for (i = 0; i < response.material.length; i++) {
						error+=response.material[i].cor_articulo_sec+', ';
					}
					alert('Error! Los siguientes Códigos ya se encuentran registrados: ' + error);	
					return
				} else {
					jQuery.ajax({
						url:'http://'+IP+':'+puerto+'/consultas?tipoc=4&sec='+localStorage.matcat,
						dataType: 'jsonp',
						crossDomain: true,
						cache: false, 
						success: function(response) {
							var xc;
							for (i = 0; i < response.material.length; i++) {
								xc=response.material[i].sum;
							}
							if (dif > xc) {
								alert('Error! Se intentan registrar ' + dif + ' artículos, y sólo se encuentran disponibles para codificar ' + xc + ' artículos.');	
								redireccionar("Codificacion.html");
							} else {
								//Servicio que genera los articulos, crea el detalle de la codificación y actualiza las recepciones	
								jQuery.ajax({
										url:'http://'+IP+':'+puerto+'/movlote?tipoc=11&fi='+CI+'&ff='+CF+'&user='+localStorage.nombre+'&alm='+localStorage.almacen+'&matcat='+localStorage.matcat+'&comp=N&matprima='+localStorage.matp+'&color='+localStorage.color+'&sec='+localStorage.mov,
										dataType: 'jsonp',
										crossDomain: true,
										cache: false, 
										success: function(response) {
											redireccionar('Codificacion.html');
										}	
									});
							}
						}	
					});
				}
			}	
		});
	}
}

// Cambia el estatus de la codificación a cerrado
function CerrarCod() {
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/movlote&callback=?tipoc=5&sec='+localStorage.Codif+'&user='+localStorage.nombre+'&est=CC',
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			redireccionar("CCodificacion.html");
		}	
	});
}