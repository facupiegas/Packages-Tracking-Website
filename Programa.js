$(document).ready(inicializo);

/*Al inicializar la pagina, ocultamos todos los divs salvo el de loguin para que el usuario pueda loguearse*/
function inicializo(){
	$("#Logueo").show();
	$("#MenuOperador").hide	();
	$("#AltaPaquetes").hide();
	$("#AsignacionEstadoPaquete").hide();
	$("#Reportes").hide();
	$("#MenuCliente").hide();
	$("#RastreoPaqueteOperario").hide();
	$("#ListadoPaquetesPendientes").hide();
	$("#AsignarPaquetes").hide();
	$("#TablaPendientes").hide();
	$("#TablaEnMenuReporte").hide();
	$("#MenuPendientesReportes").hide();
	$("#MenuResumenRepartidores").hide();
	$("#divResumenRepartidores").hide();
	window.setInterval(cargarListadoEnMenuOperario,10); //funcion que actualiza la tabla de paquetes pendientes de entrega de forma automatica

	//ASIGNO EVENTOS A LOS BOTONES
	//NAVEGACION
	$("#btnIngresar").click(loguearse);
	$("#btnCerrarSesion").click(cerrarSesion);
	$("#btnCerrarSesion2").click(cerrarSesion);
	$("#btnVolverAltaPaquete").click(MenuOperador);
	$("#btnVolverCargaEstado").click(MenuOperador);
	$("#btnVolverReportes").click(MenuOperador);
	$("#btnVolverRastreoPaqueteOperario").click(mostrarMenureportes);
	$("#btnVolverDesdePendientes").click(mostrarMenureportes);
	$("#btnVolverResumenRepartidores").click(mostrarMenureportes);
	$("#btnVolverDesdeAsignar").click(MenuOperador);
	$("#btnVolverDesdeTablaPendientes").click(mostrarMenureportes);
	//LOGICA
	$("#btnRastrearPaqueteOperaraio").click(buscoPaqueteOperador);
	$("#btnRastrearPaqueteCliente").click(buscoPaqueteCliente);
	$("#btnMenuAsignacionPaquete").click(mostrarMenuAsignoPaquetes);
	$("#btnMenuReportes").click(mostrarMenureportes);	
	$("#btnMenuAltaPaquetes").click(mostrarMenuAltaPaquete);
	$("#btnCargarEstado").click(MostrarMenuCargaEstado);
	$("#btnGuardarPaquete").click(darAltaPaquete);
	$("#btnSeguimiento").click(mostrarBuscarPaquete);
	$("#btnPaquetesPendientes").click(cargarListadoEnReportes);
	$("#btnAsignar").click(asignoPaquete);
	$("#btnAsignarEstadoViajando").click(cargarEstadoViajando);
	$("#btnAsignarEstadoEntregado").click(cargarEstadoEntregado);
	$("#btnResumenRepartidores").click(MenuResumenRepartidores);
	$("#btnGenerarResumenRepartidor").click(muestroResumenRepartidor);
}

/*PRECARGO ARRAY CON LOS COSTOS DE CADA UNO DE LOS MEDIOS DE TRASNPORTE DE LOS REPARTIDORES*/
var limitesPaquetes = {"Bicicleta":{"desde":0, "hasta":20 ,"costo":100},
					   "Moto":{"desde":21, "hasta":50 ,"costo":200},	
					   "Camioneta":{"desde":51, "hasta":1000 ,"costo":500}};

/*PRECARGO ARRAY CON LOS DATOS DE LOS REPARTIDORES*/
var repartidores = [{"codigo":1,"nombre":"Diego Lopez","medio":"Bicicleta","paq":8},   /*Precargamos el codigo de paquete (paq=0) para indicar que el repartidor se encuentra disponible, si es distinto de este valor, significa el respartidor esta ocupado*/
					{"codigo":2,"nombre":"Carlos Dominguez","medio":"Bicicleta","paq":0},
					{"codigo":3,"nombre":"Luciano Sanchez","medio":"Bicicleta","paq":4},
					{"codigo":4,"nombre":"Nicolas Bueno","medio":"Moto","paq":9},
					{"codigo":5,"nombre":"Bruno Rodriguez","medio":"Moto","paq":0},
					{"codigo":6,"nombre":"Juan Rodriguez","medio":"Moto","paq":6},
					{"codigo":7,"nombre":"Manuel Fagundez","medio":"Camioneta","paq":5},
					{"codigo":8,"nombre":"Lucia Perez","medio":"Camioneta","paq":7},
					{"codigo":9,"nombre":"Luciana Pereyra","medio":"Camioneta","paq":0}];

/*PRECARGO ARRAY CON LOS DATOS DE LOS USUARIOS*/
var usuarios = [{"cedula":11111111,"clave":"contraseña","tipo":1},	//tipo 1 (Operador)
				{"cedula":33333333,"clave":"contraseña","tipo":2},
				{"cedula":22222222,"clave":"contraseña","tipo":1},	//tipo 2 (Cliente)
				{"cedula":44444444,"clave":"contraseña","tipo":2}];

/*CREO ARRAY INDIZADO AL CUAL SE LE CARGARÁN LOS PAQUETES*/
var paquetes = [{"numPaq":1,"nomRem":"Yesica","apeRem":"Del Cap","ciRem":33333333,"nomDest":"Norberto","apeDest":"Vargas","ciDest":51487248,"direDest":"Re lejos mal","peso":01,"Recepcionado":"04:34","Procesado":"","Viajando":"","Entregado":"","codRep":0},	//Paquete recepcionado
				{"numPaq":2,"nomRem":"Brian","apeRem":"Ñeri","ciRem":97663571,"nomDest":"Norberto","apeDest":"Vargas","ciDest":44444444,"direDest":"Re lejos mal","peso":49,"Recepcionado":"10:36","Procesado":"","Viajando":"","Entregado":"","codRep":0},		//Paquete recepcionado
				{"numPaq":3,"nomRem":"Kevin","apeRem":"Stone","ciRem":12035874,"nomDest":"Norberto","apeDest":"Vargas","ciDest":51487247,"direDest":"Re lejos mal","peso":100,"Recepcionado":"10:55","Procesado":"","Viajando":"","Entregado":"","codRep":0},	//Paquete recepcionado
				{"numPaq":4,"nomRem":"Pablo","apeRem":"Escobar","ciRem":33333333,"nomDest":"Norberto","apeDest":"Vargas","ciDest":51487247,"direDest":"Re lejos mal","peso":7,"Recepcionado":"10:31","Procesado":"16:20","Viajando":"","Entregado":"","codRep":3},		//Paquete procesado	
				{"numPaq":5,"nomRem":"Susana","apeRem":"Gimenez","ciRem":44444444,"nomDest":"Norberto","apeDest":"Vargas","ciDest":51487247,"direDest":"Re lejos mal","peso":443,"Recepcionado":"10:36","Procesado":"16:34","Viajando":"","Entregado":"","codRep":7},	//Paquete procesado
				{"numPaq":6,"nomRem":"Carlos","apeRem":"Tevez","ciRem":45778541,"nomDest":"Solomeo","apeDest":"Paredes","ciDest":14786672,"direDest":"No tan lejos mal","peso":38,"Recepcionado":"14:34","Procesado":"16:15","Viajando":"","Entregado":"","codRep":6},	//Paquete procesado
				{"numPaq":7,"nomRem":"Facundo","apeRem":"Arana","ciRem":1225599,"nomDest":"Norberto","apeDest":"Vargas","ciDest":33333333,"direDest":"Re lejos mal","peso":155,"Recepcionado":"04:34","Procesado":"05:10","Viajando":"05:40","Entregado":"","codRep":8},//Paquete procesado
				{"numPaq":8,"nomRem":"Richard","apeRem":"Dete","ciRem":44444444,"nomDest":"Norberto","apeDest":"Vargas","ciDest":51487247,"direDest":"Re lejos mal","peso":13,"Recepcionado":"10:28","Procesado":"11:00","Viajando":"11:58","Entregado":"","codRep":1},						//Paquete viajando
				{"numPaq":9,"nomRem":"Juan","apeRem":"Guani","ciRem":44102533,"nomDest":"Norberto","apeDest":"Vargas","ciDest":51487247,"direDest":"Re lejos mal","peso":30,"Recepcionado":"10:17","Procesado":"16:34","Viajando":"16:37","Entregado":"","codRep":4},						//Paquete viajando
				{"numPaq":10,"nomRem":"Patricio","apeRem":"Estrella de Mar","ciRem":33748896,"nomDest":"Norberto","apeDest":"Vargas","ciDest":33333333,"direDest":"Re lejos mal","peso":44,"Recepcionado":"10:36","Procesado":"16:34","Viajando":"16:24","Entregado":"17:14","codRep":7},	//Paquete viajando
				{"numPaq":11,"nomRem":"Camila","apeRem":"Castro","ciRem":77452100,"nomDest":"Norberto","apeDest":"Vargas","ciDest":44444444,"direDest":"Re lejos mal","peso":17,"Recepcionado":"10:05","Procesado":"16:34","Viajando":"18:38","Entregado":"19:44","codRep":1},		//Paquete ya entregado
				{"numPaq":12,"nomRem":"Bob","apeRem":"Esponja","ciRem":33253333,"nomDest":"Enrique","apeDest":"Octavo","ciDest":14714672,"direDest":"No tan lejos mal","peso":05,"Recepcionado":"14:34","Procesado":"16:34","Viajando":"17:34","Entregado":"20:58","codRep":3},	//Paquete ya entregado
				{"numPaq":13,"nomRem":"Pikachu","apeRem":"Pokemon","ciRem":33333333,"nomDest":"Ricardo","apeDest":"Fort","ciDest":14758672,"direDest":"No tan lejos mal","peso":07,"Recepcionado":"14:34","Procesado":"16:34","Viajando":"17:34","Entregado":"20:58","codRep":1},	//Paquete ya entregado
				{"numPaq":14,"nomRem":"Alexander","apeRem":"Caniggia","ciRem":33333333,"nomDest":"Sifo","apeDest":"Ramos","ciDest":14789972,"direDest":"No tan lejos mal","peso":30,"Recepcionado":"14:34","Procesado":"16:34","Viajando":"17:34","Entregado":"20:58","codRep":4},	//Paquete ya entregado
				{"numPaq":15,"nomRem":"Tomas","apeRem":"Leites de Cavalho","ciRem":33333113,"nomDest":"Norberto","apeDest":"Rojas","ciDest":14732672,"direDest":"No tan lejos mal","peso":25,"Recepcionado":"14:34","Procesado":"16:34","Viajando":"17:34","Entregado":"20:58","codRep":5},	//Paquete ya entregado
				{"numPaq":16,"nomRem":"Lobo","apeRem":"Salvaje","ciRem":33333335,"nomDest":"Enrique","apeDest":"Marquez","ciDest":14786772,"direDest":"No tan lejos mal","peso":350,"Recepcionado":"14:34","Procesado":"16:34","Viajando":"17:34","Entregado":"20:58","codRep":9},	//Paquete ya entregado
				{"numPaq":17,"nomRem":"Zulma","apeRem":"Lobato","ciRem":33337833,"nomDest":"Romia","apeDest":"Juani","ciDest":14786112,"direDest":"No tan lejos mal","peso":111,"Recepcionado":"14:34","Procesado":"14:37","Viajando":"17:34","Entregado":"20:58","codRep":7}];	//Paquete ya entregado
var proxPaquete = 18 //Inicializamos la variable porxPaquete en 18 porque los numeros anteriores ya fueron utilizados en la precarga y la creamos global a la pagina para que no sea sobre escrita en la funciondarAltaPaquete

/*FUNCIONES PARA LA NAVEGACIÓN ENTRE LAS DISTINTAS PANTALLAS*/
function cerrarSesion(){
	$("#txtCiUsuario").val(""); //Limpio cajas de texto al cerrar sesion
	$("#txtClave").val("");		//Limpio cajas de texto al cerrar sesion
	$("#pErrorLogin").html("");
	$("#Logueo").show();
	$("#MenuOperador").hide();
	$("#AltaPaquetes").hide();
	$("#AsignacionEstadoPaquete").hide();
	$("#Reportes").hide();
	$("#MenuCliente").hide();
	$("#tabla").hide();	
	$("#TablaPendientes").hide();
	$("#TablaEnMenuReporte").hide();
	$("#divResumenRepartidores").hide();
}

function MenuOperador(){
	$("#Logueo").hide();
	$("#MenuOperador").show();
	$("#AltaPaquetes").hide();
	$("#AsignacionEstadoPaquete").hide();
	$("#Reportes").hide();	
	$("#MenuCliente").hide();
	$("#AsignarPaquetes").hide();
	$("#TablaEnMenuReporte").hide();
	$("#MenuPendientesReportes").hide();
	$("#divResumenRepartidores").hide();
	$("#ListadoMenu").show();
	$("#selPaquetesPendientes").html("");
	$("#selRepartidoresPendientes").html("");
}

function MenuResumenRepartidores(){
	$("#txtNumRepartidor").html("");
	$("#Logueo").hide();
	$("#MenuOperador").hide();
	$("#AltaPaquetes").hide();
	$("#AsignacionEstadoPaquete").hide();
	$("#Reportes").hide();	
	$("#MenuCliente").hide();
	$("#AsignarPaquetes").hide();
	$("#TablaEnMenuReporte").hide();
	$("#MenuResumenRepartidores").show();	
	$("#divResumenRepartidores").show();
}

function mostrarMenuAltaPaquete(){
	$("#Logueo").hide();
	$("#MenuOperador").hide();
	$("#AltaPaquetes").show();
	$("#AsignacionEstadoPaquete").hide();
	$("#Reportes").hide();
	$("#MenuCliente").hide();
	$("#TablaPaquetesPendientes").hide();
	$("#pMensajesAltaPaquete").html("");
	$("#pOkLogin").html("");
}

function mostrarMenureportes(){
	$("#Logueo").hide();
	$("#MenuOperador").hide();
	$("#AltaPaquetes").hide();
	$("#AsignacionEstadoPaquete").hide();
	$("#Reportes").show();
	$("#MenuCliente").hide();
	$("#RastreoPaqueteOperario").hide();
	$("#TablaPaquetesPendientes").hide();
	$("#TablaEnMenuReporte").hide();
	$("#MenuPendientesReportes").hide();
	$("#MenuResumenRepartidores").hide();
	$("#divResumenRepartidores").html("");
}

function MostrarMenuCargaEstado(){
	$("#Logueo").hide();
	$("#MenuOperador").hide();
	$("#AltaPaquetes").hide();
	$("#AsignacionEstadoPaquete").show();
	$("#Reportes").hide();
	$("#MenuCliente").hide();
	$("#TablaPaquetesPendientes").hide();	
	$("#pError").html("");
	$("#pOk").html("");
	$("#txtNumPaq").val("");
	$("#PaqueteRastreado").val("");
}

function mostrarBuscarPaquete(){
	$("#Logueo").hide();
	$("#MenuOperador").hide();
	$("#AltaPaquetes").hide();
	$("#AsignacionEstadoPaquete").hide();
	$("#Reportes").hide();
	$("#MenuCliente").hide();
	$("#RastreoPaqueteOperario").show();
	$("#TablaPaquetesPendientes").hide();
	$("#PaqueteRastreado").val("");
}

function mostrarMenuAsignoPaquetes(){
	$("#Logueo").hide();
	$("#MenuOperador").hide();
	$("#AltaPaquetes").hide();
	$("#AsignacionEstadoPaquete").hide();
	$("#Reportes").hide();
	$("#MenuCliente").hide();
	$("#RastreoPaqueteOperario").hide();
	$("#AsignarPaquetes").show();
	traigoPaquetesPendientes();	
	$("#pErrorEstado").html("");
	$("#pOkEstado").html("");
}

/*FUNCIONES PARA EL MANEJO Y PROCESAMIENTO DE DATOS*/

function loguearse(){ //funcion que valida usuario y clave ingresada. Dependiendo del tipo de usuario loguea como operador o cliente.

	var documento = $("#txtCiUsuario")
	var pass = $("#txtClave")
	var contador = 0;	//contador que se inicia en cero para ir recorriendo los distintos usuarios pre cargados dentro del array global "usuarios"
	var tipo1 = 1;	//definimos tipo de usuario en una variable prar su posterior validacion con el dato extraido de array "usuarios"
	var tipo2 = 2;	
	var encontre = false;

	if (!esVacio(documento) && !esVacio(pass) && esNumero(documento)){ //valido vacio y que sea valor numerico
		while (contador <= usuarios.length -1 && !encontre){	
			if (documento.val() == usuarios[contador].cedula && pass.val() == usuarios[contador].clave){ 
				encontre = true;
				$("#Logueo").hide();
				$("#AltaPaquetes").hide();
				$("#AsignacionEstadoPaquete").hide();
				$("#Reportes").hide();
				$("#MenuCliente").hide();
				$("#PieDePagina").show();;

				if(tipo1 == usuarios[contador].tipo){ //si el usuario es de tipo 1, le muestro el menu operador
					$("#MenuOperador").show();
					$("#TablaPendientes").show();
				}
				else{	//si el usuario es distito de tipo 1, le muestro el menu usuario(cliente), ni necesito otra validacion porque anteriormente me asegure de que coincidieran los datos con los que se encuentran en el array pre cargado de usuarios
					$("#MenuCliente").show();
					$("#txtNumPaqCliente").val(""); //Limpio cajas de texto
					$("#PaqueteBuscadoPorCliente").html(""); //Limpio cajas de texto e
				}
			}
			else{	//sde no obtener una coincidencia, constinuo recorriendo el array usuarios		
			contador++;		
			}
		}	
		if (encontre == false){	//si al terminar de recorrer el array usuarios, no obtuve una coincidencia, el usuario no existe. Doy aviso
			$("#pErrorLogin").html("Usuario no encontrado en el sistema")
		}
	}
	else{
		$("#pErrorLogin").html("verificar datos");
	}  
}

function darAltaPaquete(){ //funcion que da de alta un nuevo paquete, valida todos los campos de texto, los carga en un array temporal y al finalizar lo agrega al array global "paquetes" en la ultima posicion.
	var tmpPaquete = {};
	var nombreRemitente = $("#txtNomRemitente");
	var ApellidoRemitente = $("#txtApeRemitente"); //paso las cajas de texto a variables para simplificar su manejo y validacion
	var CiRemitente = $("#txtCiRemitente");
	var nombreDestinatario = $("#txtNomDestinatario");
	var apellidoDestinatario = $("#txtApeDestinatario");
	var CiDestinatario = $("#txtCiDestinatario");
	var direccion = $("#txtDireccion");
	var peso = $("#txtPeso");

	if (!esVacio(nombreRemitente) && !esVacio(ApellidoRemitente) && !esVacio(CiRemitente) && !esVacio(nombreDestinatario) 
		&& !esVacio(apellidoDestinatario) && !esVacio(CiDestinatario) && !esVacio(direccion) && !esVacio(peso)){ //valido que ningun campo quede vacio
			if(esNumero(CiRemitente)){ //valido que ambas CI sean numeros por separado para idicar donde esta la inconsistencia
				if(esNumero(CiDestinatario)){
						if(esNumero(peso)){ //valido que el peso sea un numero, caso contrario doy alerta
							if(pesoEsValido(peso)){
								//cargar datos en el array ascociativo temporal	
								tmpPaquete["numPaq"] = proxPaquete;
								tmpPaquete["nomRem"] = nombreRemitente.val();
								tmpPaquete["apeRem"] = ApellidoRemitente.val();
								tmpPaquete["ciRem"] = CiRemitente.val();
								tmpPaquete["nomDest"] = nombreDestinatario.val();
								tmpPaquete["apeDest"] = apellidoDestinatario.val();
								tmpPaquete["ciDest"] = CiDestinatario.val();
								tmpPaquete["direDest"] = direccion.val();
								tmpPaquete["peso"] = peso.val();
								tmpPaquete["Recepcionado"] = cargoHora();
								tmpPaquete["Procesado"] ="";
								tmpPaquete["Viajando"] ="";
								tmpPaquete["Entregado"] ="";
								tmpPaquete["codRep"] = 0;
										
								paquetes[paquetes.length] = tmpPaquete; //desde el array temporal agrego el paquete en la ultima posicion del array definitivo "paquetes"
								
								//vacio las cajas para dar alta a un nuevo paquete
								$("#txtNomRemitente").val("");
								$("#txtApeRemitente").val("");
								$("#txtCiRemitente").val("");
								$("#txtNomDestinatario").val("");
								$("#txtApeDestinatario").val("");
								$("#txtCiDestinatario").val("");
								$("#txtDireccion").val("");
								$("#txtPeso").val("");
								$("#pOkLogin").html("El paquete Nº" + proxPaquete + " fue cargado al sistema.");
								//vacio parrafo error
								$("#pMensajesAltaPaquete").html("");
								proxPaquete++;//incremento la variable para no repetir un mismo numero de paquete al dar otro de alta
							}
							else{
							$("#pMensajesAltaPaquete").html("El peso debe ser mayor que 0kg y menor o igual a 1000kg");
							}
						}
						else{
							$("#pMensajesAltaPaquete").html("Ingrese solo numeros en el campo Peso");
						}
				}		
				else{
					$("#pMensajesAltaPaquete").html("Ingrese solo numeros en el campo CI Destinatario");
				}
			}
			else{
			$("#pMensajesAltaPaquete").html("Ingrese solo numeros en el campo CI Remitente");
			}	
	}	
	else{
		$("#pMensajesAltaPaquete").html("Ningun campo puede quedar vacio");
		}
}	

function traigoPaquetesPendientes(){ //funcion que actualiza el combobox de paquetes pendientes para ser asignados a un repartidor de encontrarse dispobible
	$("#selPaquetesPendientes").html("");
	$("#selPaquetesPendientes").append(" <option disabled selected value> </option>");//deshabilito la primera opcion para que al seleccionar el primer paquete ya se dispare la funcion de validacion de repartidoes
	for(pos=0;pos<=paquetes.length-1;pos++){ //no deberia haber definido las variables dentro del for!!!!!!!!!
		paqTmp = paquetes[pos];
		var estadoPaqueteProcesado = paqTmp["Procesado"];//obtengo los estados de los paquetes que voy recorriendo uno a uno
		var estadoPaqueteViajando = paqTmp["Viajando"];
		var estadoPaqueteEntregado = paqTmp["Entregado"];
		var peso = paqTmp["peso"];	

		if(estadoPaqueteProcesado=="" && estadoPaqueteViajando=="" && estadoPaqueteEntregado==""){//valido que el paquete contenga la hora solamente en el estado "procesado", asegurandome que el mismo esta disponible para ser asignado a un repartidor
			$("#selPaquetesPendientes").append("<option value='"+paqTmp["numPaq"]+"'>"+paqTmp["numPaq"]+"</option>"); //si cumple con la validacion, lo agrego al combobox de paquetes pendientes para asgnar a un repartidor
		}
	}
}

function calculoCosto(pMedio,pPeso){ //funcion que recibe como parametros medio de transporte y peso, compara el medio recibido con los del array repartidores y calcula el costo en funcion del peso y del valor del transporte seleccionado
	var costo;
	if(pMedio== "Bicicleta"){
		costo = pPeso*100;
	}
	if(pMedio=="Moto"){
		costo = pPeso*200;
	}
	if(pMedio=="Camioneta"){
		costo = pPeso*500;
	}
	return costo;
}

function validoPeso(pPeso){ //funcion que recibe como parametro peso y devuelve el medio de transporte al cual el mismo pertenece, el valor siempre estara entre 1 y 1000 porque la contingencia se realiza sobre el campo de texto antes de pasar el valor
	var retorno;
	for(vehiculo in limitesPaquetes){
		dato = limitesPaquetes[vehiculo];
		if(pPeso >= dato["desde"] && pPeso <= dato["hasta"]){
			retorno = vehiculo;
		}
	}
	return retorno;
}

function traigoRepartidores(pVehiculo){ //funcion que recibe como parametro un medio de transporte para luego recorrer el array "repartidores". De coincidir el medio recibido con el del repartidor y encontrarse libre (paqRep=0), lo agrega al combobox de repartidores disponibles para asignar un paquete
	$("#selRepartidoresPendientes").html("");
	
	for(pos=0;pos<=repartidores.length-1;pos++){//no debo crear variables dentro del for!!!!!!!
		var repTmp = repartidores[pos];
		var medioRepartidor = repTmp["medio"];
		var paqRep = repTmp["paq"];	
		if(pVehiculo == medioRepartidor && paqRep == 0){//valido si el medio del repartidor coincide con el recibido y si el mismo se encuentra disponible
			$("#selRepartidoresPendientes").append("<option value='"+repTmp["nombre"]+"'>"+repTmp["nombre"]+"</option>");
		}
	}
}

function actualizoBoxRepartidores(codPaquete){ //funcion que actualiza el combobox de repartidores verificando el peso del paquete y que el repartidor se encuentre disponible
	var numPaqTmp =	codPaquete.value;//extraigo el value del parametro recibido y lo convierto a una varaible por practicidad
	var paqueteEncontrado = buscoPaquete(numPaqTmp);//con el numero de paquete recibido y medienta el funcion "biscoPaquete", obtengo el paquete "objeto"(con todas sus informaciones) desde array paquetes 
	var peso = paqueteEncontrado.peso; //extraigo el value de la clave peso del paquete encontrado previamente
	traigoRepartidores(validoPeso(peso));//actualizo el box de repartidores validando el peso, el cual me devuelve el medio en el cual el paquete va a ser transportado, y con este, traigo los repartidores que poseen dicho medio y se encuentran disponibles
}

function traigoCodRepartidor(pNombre){ //funcion que recibe el nombre del repartidor y devuelve el codigo del mismo para cargarlo al paquete
	var retorno
	for(pos=0;pos<=repartidores.length-1;pos++){//no debo declarar variables dentro del for!!!!!
		var repTmp = repartidores[pos];//comienzo a recorrer array repartidores uno a uno
		var nombreRepartidor = repTmp["nombre"];//extraigo el nombre del repartidor situado en la posicion cero del array
		if(pNombre == nombreRepartidor ){//lo comparo con el recibido por la funcion(que es el de quien deseo obtener el codigo)
			retorno = repTmp["codigo"]//si el nombre del repartidor de la posicion en la cual me encuentro es igual al que recibio la funcion, extraigo su codigo(value de "codigo") y lo devuelvo en return de la funcion.
		}
	}
	return retorno;
}

function asignoPaqueteARepartidor(pNombre,pNumPaq){ //funcion que recibe como parametros nombre de repartidor y un numero de paquete para luego asignarselo a este (repTmp["paq"] = pNumPaq)
	var pos = 0;
	var encontre = false;
	while(pos<=repartidores.length-1 && !encontre){//recorro el array repartidores hasta encontrar el que recibi como parametro
		var repTmp = repartidores[pos];//simplifico
		var nombreRepartidor = repTmp["nombre"];//obtengo el nombre del repartidor de la posicion en la que me encuentro
		if(pNombre == nombreRepartidor){//comparo si es igual al que recibi como parametro
			encontre = true;
			repTmp["paq"] = pNumPaq;//si es igual, le asigno el numero de paquete que recibi como parametro. El repartidor ahora se encuentra "ocupado", ya que "paq" distinto de 0 
		}
	pos++;
	}
}

function liberoRepartidor(pcodRep){ //funcion que recibe un codigo de repartidor y lo libera (repTmp["paq"] = 0) para poder recibir un nuevo paquete
	var pos = 0;
	var encontre = false;
	while(pos<=repartidores.length-1 && !encontre){
	var repTmp = repartidores[pos];
	var codigoRepartidorEnArray = repTmp["codigo"];
			if(pcodRep == codigoRepartidorEnArray){
			encontre = true;
			repTmp["paq"] = 0;
		}
	pos++;
	}
}

function buscoPaquete(codPaq){ // funcion que recibe un numero y busca el paquete dentro del array "paquetes"
	var encontre = false;
	var pos = 0;
	var paquete = null;//creo la variable en null ya que doy por sentado que el paquete inicialmente no existe
	while(pos<=paquetes.length-1 && !encontre){
		if(paquetes[pos].numPaq==codPaq){
			encontre = true;
			paquete = paquetes[pos];//si encuento el paquete que busco en el array, cargo su informacion en la variable
		}
		pos++;
	}
	return paquete;//devuelvo el paquete bscado(si lo encontre), con sus informaciones
}

function  listarPaquetesPendientes(){ // funcion que crea una tabla con todos paquetes que se encuentran pendientes de entrega 
	var totalPaquetesPendientes=0;
	var horaActual = cargoHora();
	var retorno = "<center><h2>PAQUETES PENDIENTES DE ENTREGA</h2></center> <br> <center> <table border='2'><tr><td>Numero de Paquete</td><td>Recepcionado</td><td>Procesado</td><td>Viajando</td></tr>";
	for(pos=0;pos<=paquetes.length-1;pos++){
		paqTmp = paquetes[pos];
		var estadoPaqueteRecepcionado = paqTmp["Recepcionado"];
		var estadoPaqueteProcesado = paqTmp["Procesado"];
		var estadoPaqueteEntregado = paqTmp["Entregado"];
			if(estadoPaqueteRecepcionado !="" && estadoPaqueteProcesado!="" && estadoPaqueteEntregado==""){//valido que el paquete se encuentre pendiente(estados "recepcionado" y "viajando" deben contener hora) y que no haya sido "entregado" ==""
					retorno = retorno + "<center>" + "<tr>";
					retorno = retorno + "<td>" + "<center>" + paqTmp["numPaq"] + "</td>" + "</center>";		
					retorno = retorno + "<td>" + "<center>" + estadoPaqueteRecepcionado + "</td>" + "</center>";
					retorno = retorno + "<td>" + "<center>" + estadoPaqueteProcesado + "</td>" + "</center>";	
					retorno = retorno + "<td>" + "<center>" + paqTmp["Viajando"] + "</td>" + "</center>";
					retorno = retorno + "</tr>" + "</center>";
				totalPaquetesPendientes++//cada vez que agrego un nuevo paquete a la lista de pendientes incremento el contador
			}
	}
	retorno = retorno +"<tr align='center'><td colspan=2>Total paquetes pendientes</td><td colspan=2>"+ totalPaquetesPendientes + "</td></tr>" + "</table>" + "</center>";
	return retorno;
}

function cargarListadoEnReportes(){ //funcion que carga la tabla obtenida de "listarPaquetesPendientes" en en la pantalla "Listado de paquetes de entrega" del menu reportes, es la misma tabla que el operario puede ver en todo momento
	$("#Logueo").hide();
	$("#MenuOperador").hide();
	$("#AltaPaquetes").hide();
	$("#AsignacionEstadoPaquete").hide();
	$("#Reportes").hide();
	$("#MenuCliente").hide();
	$("#PieDePagina").show();
	$("#RastreoPaqueteOperario").hide();
	$("#AsignarPaquetes").hide();
	$("#MenuPendientesReportes").show();
	$("#TablaEnMenuReporte").html(listarPaquetesPendientes());
}

function cargarListadoEnMenuOperario(){ //funcion que carga la lista obtenida de "listarPaquetesPendientes" en un div el cual se muestra en todo momento, esta funcion se ejecuta de forma automatica
	$("#TablaPendientes").html(listarPaquetesPendientes());
}

function asignoPaquete(){ //funcion que asigna un paquete a un repartidor de encontrarse disponible
	var numPaq = $("#selPaquetesPendientes").val(); /*Saco el dato seleccionado en el comboBox y lo convierto a una variable*/
	var paqueteEnArray =buscoPaquete(numPaq); /*Con el numero obtenido anteriormente, traigo el paquete que deseo asignar del array global paquetes*/
	var codigoRepartidor = traigoCodRepartidor($("#selRepartidoresPendientes").val()); //extraigo el codigo del repartidor y lo convierto a una variable
	if($("#selPaquetesPendientes").val() != null){ //valido que se haya seleccionado un paquete para asignar
		if($("#selRepartidoresPendientes").val() != null){ //como el combo de repartidores se actializa de forma automatica al seleccionar un paquete, de no encontrarse ninguno disponible, cuando el operador intente asignar le doy el aviso de que no hay ninguno disponible
			paqueteEnArray["Procesado"] = cargoHora(); //cargo la hora en el estado "Procesado" del paquete
			paqueteEnArray["codRep"] = codigoRepartidor //cargo el codigo del repartidor en el array del paquete para luego poder hacer una busqueda del mismo por codigo de repartidor (Reporte)
			asignoPaqueteARepartidor($("#selRepartidoresPendientes").val(),numPaq); //le paso los parametros a la funcion explicada anteriormente la cual asignara un numero de paquete al repartidor haciendo que este pase de estar libre a ocupado
			
		$("#pOkEstado").html("El paquete Nº " + numPaq + " fue asignado al repartidor");
		$("#pErrorEstado").html("");
		}
		else{
		$("#pErrorEstado").html("No existen repartidores disponibles en este momento");
		$("#pOkEstado").html("")
		}
	}
	else{
		$("#pErrorEstado").html("Seleccione un paquete para asignar");
		$("#pOkEstado").html("");
	}
	$("#selPaquetesPendientes").val("");		//limpio los combos
	$("#selRepartidoresPendientes").val("");	//limpio los combos
	traigoPaquetesPendientes()	//vuelvo a actualizar el combo de repartidores pendientes
}

function cargarEstadoViajando(){ //funcion que carga la hora la estado "Viajando" del paquete
	
	var paqueteIngresado = $("#txtNumPaq").val();
	var paqueteEnArray =buscoPaquete(paqueteIngresado);

		if(!esVacio($("#txtNumPaq"))){
			if(esNumero($("#txtNumPaq"))){
				if (paqueteEnArray != null){
					if(paqueteEnArray["Entregado"] ==""){
						if(paqueteEnArray["Viajando"] ==""){
							if(paqueteEnArray["Procesado"] !=""){
								pos=0;
								encontre=false;
								while(pos<=paquetes.length-1 && !encontre){
									paqueteEnArray["Viajando"] = cargoHora();
									encontre = true;
									pos++
								}
								$("#pOk").html("El estado 'Viajando' del paquete Nº " + paqueteIngresado + " ha sido actualizado con la hora "+ cargoHora());
								$("#pError").html("");
								$("#txtNumPaq").val("");
							}
							else{
							$("#pError").html("El paquete aun no ha sido procesado");
							$("#pOk").html("");
							}
						}
						else{
						$("#pError").html("El paquete se encuentra Viajando");
						$("#pOk").html("");
						}
					}
					else{
						$("#pError").html("El paquete ya ha sido entregado");
						$("#pOk").html("");
					}	
				}
				else{
				$("#pError").html("Paquete no encontrado en el sistema");
				$("#pOk").html("");
				}
			}
			else{
				$("#pError").html("Debe introducir solo numeros");
				$("#pOk").html("");
			}
		}
		else{
			$("#pError").html("El campo no puede estar vacio");
			$("#pOk").html("");
		}	
}

function cargarEstadoEntregado(){ //funcion que carga la hora la estado "Entregado" del paquete
	
	var paqueteIngresado = $("#txtNumPaq").val();
	var paqueteEnArray =buscoPaquete(paqueteIngresado);

		if(!esVacio($("#txtNumPaq"))){
			if(esNumero($("#txtNumPaq"))){
				if (paqueteEnArray != null){
					if(paqueteEnArray["Entregado"] ==""){
						if(paqueteEnArray["Viajando"] !=""){
							if(paqueteEnArray["Procesado"] !=""){
								pos=0;
								encontre=false;
								while(pos<=paquetes.length-1 && !encontre){
									paqueteEnArray["Entregado"] = cargoHora();
									encontre = true;
									codigoRepartidor = paqueteEnArray["codRep"];
									liberoRepartidor(codigoRepartidor);

									pos++
								}
								$("#pOk").html("El estado 'Entregado' del paquete Nº " + paqueteIngresado + " ha sido actualizado con la hora "+ cargoHora());
								$("#pError").html("");
								$("#txtNumPaq").val("");
							}
							else{
							$("#pError").html("El paquete aun no ha sido procesado");
							$("#pOk").html("");
							}
						}
						else{
						$("#pError").html("El paquete aun no se encuentra Viajando");
						$("#pOk").html("");
						}
					}
					else{
						$("#pError").html("El paquete ya ha sido entregado");
						$("#pOk").html("");
					}	
				}
				else{
				$("#pError").html("Paquete no encontrado en el sistema");
				$("#pOk").html("");
				}
			}
			else{
				$("#pError").html("Debe introducir solo numeros");
				$("#pOk").html("");
			}
		}
		else{
			$("#pError").html("El campo no puede estar vacio");
			$("#pOk").html("");
		}	
}

function buscoPaqueteOperador(){ //funcion que carga la tabla obtenida de (muestroPaqueteBuscadoOperador) en el div para que el Operador pueda verla
	$("#PaqueteRastreado").html(muestroPaqueteBuscadoOperador());
}

function buscoPaqueteCliente(){ //funcion que carga la tabla obtenida de (muestroPaqueteBuscadoCliente) en el div para que el Cliente pueda verla
	$("#PaqueteBuscadoPorCliente").html(muestroPaqueteBuscadoCliente());
}

function muestroPaqueteBuscadoOperador(){ //funcion para realizar un busqueda de un paquete, no tiene restriccion alguna por ser un operador
	var numeroPaqueteBuscado = $("#txtNumPaqOperaraio").val();
	var	paqTmp = buscoPaquete(numeroPaqueteBuscado);
	if(!esVacio($("#txtNumPaqOperaraio"))){
		if(esNumero($("#txtNumPaqOperaraio"))){
			if (paqTmp != null){
				var retorno = "<center> <table border='2'><tr><td>Numero de Paquete</td><td>Recepcionado</td><td>Procesado</td><td>Viajando</td><td>Entregado</td><td>Costo</td></tr>";
				var estadoPaqueteRecepcionado = paqTmp["Recepcionado"];
				var estadoPaqueteProcesado = paqTmp["Procesado"];
				var estadoPaqueteViajando = paqTmp["Viajando"];
				var estadoPaqueteEntregado = paqTmp["Entregado"];
				var peso = paqTmp["peso"];
				var costo = calculoCosto(validoPeso(peso),peso);
				if(estadoPaqueteRecepcionado!=""){
					if(estadoPaqueteEntregado!=""){
						retorno = retorno + "<center>" + "<tr>";
						retorno = retorno + "<td>" + "<center>" + numeroPaqueteBuscado + "</td>" + "</center>";		
						retorno = retorno + "<td>" + "<center>" + estadoPaqueteRecepcionado + "</td>" + "</center>";
						retorno = retorno + "<td>" + "<center>" + estadoPaqueteProcesado + "</td>" + "</center>";	
						retorno = retorno + "<td>" + "<center>" +estadoPaqueteViajando + "</td>" + "</center>";
						retorno = retorno + "<td>" + "<center>" +estadoPaqueteEntregado + "</td>" + "</center>";
						retorno = retorno + "<td>" + "<center>" + costo + "</td>" + "</center>";
						retorno = retorno + "</tr>" + "</center>";
					}
					else{
						retorno = retorno + "<center>" + "<tr>";
						retorno = retorno + "<td>" + "<center>" + numeroPaqueteBuscado + "</td>" + "</center>";		
						retorno = retorno + "<td>" + "<center>" + estadoPaqueteRecepcionado + "</td>" + "</center>";
						retorno = retorno + "<td>" + "<center>" + estadoPaqueteProcesado + "</td>" + "</center>";	
						retorno = retorno + "<td>" + "<center>" +estadoPaqueteViajando + "</td>" + "</center>";
						retorno = retorno + "<td>" + "<center>" +estadoPaqueteEntregado + "</td>" + "</center>";
						retorno = retorno + "<td>" + "<center>" + "N/A"  + "</td>" + "</center>";
						retorno = retorno + "</tr>" + "</center>";	
					}
				}
			}	
			else{
				retorno = "paquete no existe en el sistema"
			}
		}
		else{
			retorno = "Debe introducir solo numeros"
		}
	}
	else{
		retorno = "El campo no puede estar vacio"
	}
	retorno = retorno + "</table>" + "</center>";
	return retorno;	
}

function muestroPaqueteBuscadoCliente(){ //funcion para realizar un busqueda de un paquete, al tratarse de un cliente tiene como restriccion que la CI del mismo este en el campo "CI Remitente" o "CI Destinatario"
	var numeroPaqueteBuscado = $("#txtNumPaqCliente").val();
	var paqTmp = buscoPaquete(numeroPaqueteBuscado);
	if(!esVacio($("#txtNumPaqCliente"))){
		if(esNumero($("#txtNumPaqCliente"))){
			if (paqTmp != null){
				var ciUsuarioLogueado = $("#txtCiUsuario").val();
				var ciRemitenteEnArray = paqTmp["ciRem"];
				var ciDestinatarioEnArray = paqTmp["ciDest"];
				if (ciRemitenteEnArray == ciUsuarioLogueado || ciDestinatarioEnArray == ciUsuarioLogueado){			
					var retorno = "<center> <table border='2'><tr><td>Numero de Paquete</td><td>Recepcionado</td><td>Procesado</td><td>Viajando</td><td>Entregado</td><td>Costo</td></tr>";
					var estadoPaqueteRecepcionado = paqTmp["Recepcionado"];
					var estadoPaqueteProcesado = paqTmp["Procesado"];
					var estadoPaqueteViajando = paqTmp["Viajando"];
					var estadoPaqueteEntregado = paqTmp["Entregado"];
					var peso = paqTmp["peso"];
					var costo = calculoCosto(validoPeso(peso),peso);
					if(estadoPaqueteRecepcionado!=""){
						if(estadoPaqueteEntregado!=""){
							retorno = retorno + "<center>" + "<tr>";
							retorno = retorno + "<td>" + "<center>" + numeroPaqueteBuscado + "</td>" + "</center>";		
							retorno = retorno + "<td>" + "<center>" + estadoPaqueteRecepcionado + "</td>" + "</center>";
							retorno = retorno + "<td>" + "<center>" + estadoPaqueteProcesado + "</td>" + "</center>";	
							retorno = retorno + "<td>" + "<center>" +estadoPaqueteViajando + "</td>" + "</center>";
							retorno = retorno + "<td>" + "<center>" +estadoPaqueteEntregado + "</td>" + "</center>";
							retorno = retorno + "<td>" + "<center>" + costo + "</td>" + "</center>";
							retorno = retorno + "</tr>" + "</center>";
						}
						else{
							retorno = retorno + "<center>" + "<tr>";
							retorno = retorno + "<td>" + "<center>" + numeroPaqueteBuscado + "</td>" + "</center>";		
							retorno = retorno + "<td>" + "<center>" + estadoPaqueteRecepcionado + "</td>" + "</center>";
							retorno = retorno + "<td>" + "<center>" + estadoPaqueteProcesado + "</td>" + "</center>";	
							retorno = retorno + "<td>" + "<center>" +estadoPaqueteViajando + "</td>" + "</center>";
							retorno = retorno + "<td>" + "<center>" +estadoPaqueteEntregado + "</td>" + "</center>";
							retorno = retorno + "<td>" + "<center>" + "N/A"  + "</td>" + "</center>";
							retorno = retorno + "</tr>" + "</center>";	
						}
					}
					else{
					retorno = "paquete no existe en el sistema"
					}
				}
				else{
				retorno = "paquete no existe en el sistema"
				}
			}
			else{
				retorno = "Paquete no encontrado en el sistema"
			}
		}	
		else{
			retorno = "Debe introducir solo numeros"
		}
	}
	else{
		retorno = "El campo no puede estar vacio"
	}	
	retorno = retorno + "</table>" + "</center>";
	return retorno;	
}

function preparoResumenRepartidor(){ //funcion que crea la tabla de paquetes entregados por un repartidor
	var retorno = "<center><h2>RESUMEN ENTREGAS</h2></center> <br> <center> <table border='2'><tr><td>Codigo de Repartidor</td><td>Numero de Paquete</td><td>Entregado</td><td>Costo</td></tr>";
	var numRepartidor = $("#txtNumRepartidor").val();
	if(!esVacio($("#txtNumRepartidor"))){
		if(esNumero($("#txtNumRepartidor"))){
			for (pos =0 ;pos <= paquetes.length-1; pos++) {
			var paqTmp =paquetes[pos];
			var codigoRepartidorEnArray = paqTmp["codRep"];
			var peso = paqTmp["peso"];
			var difHora = (parseInt(paqTmp["Entregado"]) - parseInt(paqTmp["Procesado"]))
			var costo = calculoCosto(validoPeso(peso),peso);
				if(codigoRepartidorEnArray == numRepartidor){
					if(paqTmp["Entregado"] != "" && difHora <= 4){
						retorno = retorno + "<center>" + "<tr>";
						retorno = retorno + "<td>" + "<center>" + numRepartidor + "</td>" + "</center>";
						retorno = retorno + "<td>" + "<center>" + paqTmp["numPaq"] + "</td>" + "</center>";		
						retorno = retorno + "<td>" + "<center>" + paqTmp["Entregado"] + "</td>" + "</center>";
						retorno = retorno + "<td>" + "<center>" + costo + "</td>" + "</center>";	
						retorno = retorno + "</tr>" + "</center>";
					}
				}
			}
		}	
		else{
		retorno = "Ingrese solamente numeros"
		}
	}	
	else{
		retorno = "El campo no puede estar vacio"
	}	
	retorno = retorno + "</table>" + "</center>";
	return retorno;
}

function muestroResumenRepartidor(){ //funcion que muestra la tabla de paquetes entregados por un repartidor
	$("#divResumenRepartidores").html(preparoResumenRepartidor());
	$("#txtNumRepartidor").val("");
}

/*Ordeno los paquetes por la hora del estado Entregado de forma descenedente*/
paquetes.reverse([ordenoArray]);

function ordenoArray(H1,H2){
	var retorno = 0;
	if(H1 ["Entregado"] > H2 ["Entregado"]){
		retorno = 1
	}
	else{
		if(H1 ["Entregado"] > H2 ["Entregado"]){
			retorno = -1;
		}
	}
	return retorno;
}

function esNumero(dato){ //Funcion que que recibe un dato y valida que el mismo sea un numero
	var resultado=true;//creo una variable retorno con valor true para evaluar si el dato es numero o no

		if (isNaN (dato.val())){//obtengo el valor del parametro y verifico si no es numero, caso afirmativo, return se vualve false.
			resultado = false;
		}
	return resultado;
}

function esVacio(dato){	//Funcion que valida que el campo no haya quedado vacio
	var retorno = false;

	if(dato.val()==""){		
		retorno = true;
	}
	return retorno;
}

function pesoEsValido(dato){ //Funcion que valida que el peso ingresado se encuentre dentro del rango valido	
	var retorno = false;

	if((dato.val()>0) && dato.val()<=1000){		
		retorno = true;
	}
	return retorno;
}

function cargoHora(){ //Funcion que obtiene la hora del sistema para cargarla a un estado
	var fecha = new Date();
	var minutos = "" + fecha.getMinutes();
	if(minutos.length == 1){//si los minutos tienen un 0, se lo agrego ya que sino la hora quedaria formato HH:M
		minutos = "0" + minutos;
	}
	var hora;
	hora = fecha.getHours() + ":" + minutos;
	return hora;
}


