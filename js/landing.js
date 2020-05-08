document.addEventListener("DOMContentLoaded", function() {

	var UI = {

		registeredCheck: function(){

			let xhr = new XMLHttpRequest();
			xhr.open('GET', window.location.href+'api/login.php');
			xhr.send(null);

			xhr.addEventListener("load", function(){
				loadEventInfo(JSON.parse(xhr.responseText));
			});

			function loadEventInfo(res){
				console.log(res);

				if (res["registered"] === true && !document.querySelector("iframe")) {
					let html = document.createDocumentFragment(),
						h2 = document.createElement("h2"),
						p = document.createElement("p"),
						iframe = document.createElement("iframe"),
						h2Text = document.createTextNode("Thank You for registering!"),
						pText = document.createTextNode("The event is scheduled for November 5-6, 2pm at the Sonnenburg Convention Center in Zurich, Switzerland.");

					h2.appendChild(h2Text);
					p.appendChild(pText);
					html.appendChild(h2);
					html.appendChild(p);
					iframe.setAttribute("src", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43240.40270508288!2d8.489571016874297!3d47.36266766722516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x4863c23a130a6827!2sSonnenberg+Convention+Center!5e0!3m2!1sen!2sus!4v1525047408165");
					html.appendChild(iframe);

					document.getElementById("about").appendChild(html);
				}

			}
			
		},

		formListener: function(){
			let form = document.querySelector("form");

			form.querySelector("input[type='submit']").addEventListener("click", function(e){
				e.preventDefault();
				let popup = document.getElementById("popup"),
					inputs = form.getElementsByTagName("input");

				if (inputs[0].value.length > 0 && inputs[1].value.length > 0 && inputs[2].value.length > 0 ) {
					if (!Data.sent) {
						UI.showPopup();
						UI.popupListener();
						UI.closePopupListener();
					} else {
						UI.showPopup();
					}
					
				} else {
					alert("Please complete all fields before submitting. Thank you!");
				}
			});
		},

		removeForm: function(){
			let rsvp = document.getElementById("rsvp");
			rsvp.querySelector("form").remove();
		},

		showPopup: function(){ 
			document.getElementById("popup").style.display = "block";
			document.getElementById("popupBg").style.display = "block";
		},

		popupListener: function(){

			document.getElementById("fileUpload").addEventListener("change", function(){
				let type = this.files[0].type,
					label = document.querySelector("label");

				if (type == "image/jpeg" || type == "image/png" || type == "image/gif") {
					let fr = new FileReader();
					fr.addEventListener("load", function(){ document.querySelector("label").style.backgroundImage = `url(${fr.result})` });
					fr.readAsDataURL(this.files[0]);
					label.classList.add("uploaded");
					label.innerHTML = this.files[0].name;


				} else {
					document.getElementById("popup").querySelectorAll("input")[4].value = "";
					alert("Only .jpg, .png, and .gif images are supported. Please upload the correct file type.");
				}
			});


			document.getElementById("popup").querySelector("button").addEventListener("click", function(){
				let completedField = 0,
					newGuestArr = [
						document.querySelector("input[name='firstName']").value,
						document.querySelector("input[name='lastName']").value,
						document.querySelector("input[name='email']").value,
						document.querySelector("input[name='street']").value,
						document.querySelector("input[name='city']").value,
						document.querySelector("input[name='stateOrProvince']").value,
						document.querySelector("input[name='zip']").value,
						document.getElementById("fileUpload").files[0]
					];

				for (var i = newGuestArr.length - 2; i >= 0; i--) {
					console.log(newGuestArr);
					console.log(newGuestArr[i]);
					console.log(newGuestArr[i].length);
					newGuestArr[i].length < 1 ? "" : completedField++;
				}

				completedField >= 7 ? Data.saveGuest(newGuestArr) : alert("Please complete all fields before submitting. Thank you!");
			});
		},

		closePopupListener(){
			document.getElementById("popup").querySelector("span").addEventListener("click", function(){ UI.closePopup(false); });
		},

		closePopup: function(){
			if (Data.sent) {
				document.getElementById("popup").innerHTML = `<div id="popupOuter"><h1 style="text-align: center; color: yellow;">Thank You!</h1></div>`;
				setTimeout(function(){
					document.getElementById("popup").style.display = "none"; 
					document.getElementById("popupBg").style.display = "none";
					for (var i = document.getElementsByTagName("input[type='text']").length - 1; i >= 0; i--) {
						document.getElementsByTagName("input[type='text']")[i].value = "";
					}
				}, 1000);
			} else {
				setTimeout(function(){
					document.getElementById("popup").style.display = "none"; 
					document.getElementById("popupBg").style.display = "none";
				}, 250);
			}
			
		},

		menuListener: function(){
			for (var i = document.getElementsByClassName("menu").length - 1; i >= 0; i--) {
				let menu = document.getElementsByClassName("menu")[i];
				menu.addEventListener("click", function(){ UI.menuChange(menu); });
			}
		},

		menuChange: function(menu){
			for (var i = document.getElementsByClassName("menu").length - 1; i >= 0; i--) {
				document.getElementsByClassName("menu")[i].classList.remove("selected");
				document.getElementsByClassName("content")[i].classList.remove("show");
			}

			document.querySelector(`[data-nav="${menu.dataset.nav}"]`).classList.add("selected");
			document.getElementById(menu.dataset.nav).classList.add("show");

			if (menu.dataset.nav == "guests"){
				Data.getGuests();
			}

		},

		populateTable: function(data){
			document.querySelector("table").innerHTML = "";
			document.getElementById("tableSearch").placeholder = `Search ${data.length} RSVP'ed Guests...`;
			UI.searchListener();

			var html = document.createDocumentFragment(),
				scrollDiv = document.createElement("div"),
				theadTr = document.createElement("tr"),
				thead = document.createElement("thead");
				tbody = document.createElement("tbody"),
				theadArr = ["#", "Portrait", "First", "Last", "Street", "City", "State/Province", "Zip"];

			for (var i = 0; i < theadArr.length; i++) {
				let th = document.createElement("th"),
					text = document.createTextNode(theadArr[i]);

				th.appendChild(text);
				theadTr.appendChild(th);
				thead.appendChild(theadTr);
			}

			scrollDiv.appendChild(thead);

			for (var i = 0; i < data.length; i++) {
					let tr = document.createElement("tr"),
						indexTd = document.createElement("td"),
						imgTd = document.createElement("td"),
						img = document.createElement("img"),
						imgSrc = document.createAttribute("src"),
						firstNameTd = document.createElement("td"),
						lastNameTd = document.createElement("td"),
						streetTd = document.createElement("td"),
						cityTd = document.createElement("td"),
						stateOrProvinceTd = document.createElement("td"),
						zipTd = document.createElement("td"),
						tdArr = [indexTd, imgTd, firstNameTd, lastNameTd, streetTd, cityTd, stateOrProvinceTd, zipTd];

					tdArr[0].appendChild(document.createTextNode(data[i]["id"]));
					imgSrc.value = data[i]["img"];
					img.setAttributeNode(imgSrc);
					tdArr[1].appendChild(img);
					tdArr[2].appendChild(document.createTextNode(data[i]["firstName"]));
					tdArr[3].appendChild(document.createTextNode(data[i]["lastName"]));
					tdArr[4].appendChild(document.createTextNode(data[i]["street"]));
					tdArr[5].appendChild(document.createTextNode(data[i]["city"]));
					tdArr[6].appendChild(document.createTextNode(data[i]["stateOrProvince"]));
					tdArr[7].appendChild(document.createTextNode(data[i]["zip"]));

					for (var n = 0; n < tdArr.length; n++) {
						tr.appendChild(tdArr[n]);
					}
					
					tbody.appendChild(tr);
			}	

			scrollDiv.setAttribute("id", "tbodyScroll");
			scrollDiv.appendChild(tbody);
			html.appendChild(scrollDiv);
			document.querySelector("table").appendChild(html);
		},

		searchTable: function(){
			// Two Tiered Search For Performance Reasons
			let search = document.getElementById("tableSearch"),
				keyword = search.value.toUpperCase(),
				keywordArr = keyword.split(""),
				tbody = document.querySelector("tbody"),
				tr = tbody.getElementsByTagName("tr"),
				filterIndex = document.querySelector("select").value,

			exactMatch = function(td, tr){
				// Search Funnel Narrow
				console.log("exactMatch()");
				let count = 0;

				for (var i = keywordArr.length - 1; i >= 0; i--) {
					console.log(keywordArr[i]);
					console.log(td.innerHTML.toUpperCase().indexOf(keywordArr[i]))
					i == td.innerHTML.toUpperCase().indexOf(keywordArr[i]) ? count++ : tr.style.display = "none";
				}

				if (count == keywordArr.length) { tr.style.display = "" }
			}; 	

			for (i = 0; i < tr.length; i++) {
				let td = tr[i].getElementsByTagName("td")[filterIndex];
				// Search Funnel Broad
				td.innerHTML.toUpperCase().indexOf(keyword) > -1 ? exactMatch(td, tr[i]) : tr[i].style.display = "none";
			}

     
		},

		searchListener: function(){
			let search = document.getElementById("tableSearch");
			search.addEventListener("keyup", function(){ UI.searchTable() });
			document.getElementById("searchDropdown").addEventListener("change", function(){ 
				search.value = ""; 
				UI.showAllRows();
			});
		},

		showAllRows: function(){
			for (var i = document.getElementsByTagName("tr").length - 1; i >= 0; i--) {
				document.getElementsByTagName("tr")[i].style.display= "";
			}
		}
	}


	var Data = {

		sent: false,

		getGuests: function(){
			let xhr = new XMLHttpRequest();
			xhr.open('GET', window.location.href+'api/get_guests.php');
			xhr.send(null);

			xhr.addEventListener("load", function(){
				UI.populateTable(JSON.parse(xhr.responseText));
			});
		},

		saveGuest: function(varArr){
			let fieldArr = ["firstName", "lastName", "email", "street", "city", "stateOrProvince", "zip", "img"],
				formData = new FormData(),
				xhr = new XMLHttpRequest();

			for (var i = 0; i < varArr.length; i++) {
				formData.append(fieldArr[i], varArr[i]);
			}

			xhr.open('POST', window.location.href+'api/save_guest.php');
			xhr.send(formData);

			xhr.onreadystatechange = function(v){
				if (xhr.status === 200){ 
					if (xhr.readyState == 4){
						Data.sent = true; 
						UI.closePopup();
						UI.removeForm();
						cookie(varArr); 
						logger(xhr);
					}
				} else { 
					alert('Error: ' + xhr.status);
					logger(xhr); 
				}
			};

			function cookie(){
				let xhr = new XMLHttpRequest(),
					formData = new FormData(),
					num = Math.random();

				formData.append("guestID", num);

				xhr.open('POST', window.location.href+'api/login.php');
				xhr.send(formData);

				xhr.addEventListener("load", function(){
					UI.registeredCheck(xhr.responseText);
				});
			}

			function logger(xhr){
				let responseXHR = new XMLHttpRequest(),
					formData = new FormData();

				formData.append("responseText", xhr.responseText);
				responseXHR.open('POST', window.location.href+'api/debug_logger.php');
				responseXHR.send(formData);
			}
		}

	}


	var Obj = {

		scene: null,
		renderer: null,
		camera: null,
		outerSphereVerticesArray: [],
		ballObject: new THREE.Group(),
		bMap: new THREE.TextureLoader().load("img/gold-texture.jpg"),

		init: function(){
			Obj.scene = new THREE.Scene(),
			Obj.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 ),
			Obj.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

			Obj.camera.position.set(0,0,-1000);
    		Obj.camera.lookAt(new THREE.Vector3(0,0,0));
    		// Obj.controls = new THREE.OrbitControls( Obj.camera ); // Debugging 3D 
			Obj.scene.add(Obj.camera);
			Obj.scene.fog = new THREE.FogExp2(new THREE.Color(0xffffff), 0.0007);
			Obj.renderer.setClearColor(0xffffff, 0);

			Obj.renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( Obj.renderer.domElement );
		},

		setObjSize: function(){
			let canvas = document.querySelector("canvas");
			Obj.renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
			Obj.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			Obj.camera.updateProjectionMatrix();
		},

		resizeListener: function(){
			window.addEventListener('resize', function(){
				console.log("resize");
				Obj.setObjSize();
			});
			window.addEventListener('orientationchange', function(){
				console.log("orientationchange");	
				Obj.setObjSize();
			});
		},

		addLighting: function(){
			var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 ),
			  	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

			directionalLight.position.set( 600, 0, -1000 );
			directionalLight.name = "directionalLight";
			directionalLight.target = Obj.scene.getObjectByName("sphereObject");
			ambientLight.name = "ambientLight";
			Obj.scene.add(directionalLight);
			Obj.scene.add(ambientLight);
		},

		addCircleBackground: function(){
			var geometry = new THREE.CircleBufferGeometry( 1100, 100 ),
				material = new THREE.MeshBasicMaterial( { color: 0xffffff } ),
				circle = new THREE.Mesh( geometry, material );

			circle.material.side = THREE.DoubleSide;
			circle.position.set(1400,0,1000);
			circle.lookAt(Obj.camera.position);
			Obj.scene.add(circle);
		},

		addOuterSphere: function(){
			var outerSphereGeom = new THREE.SphereGeometry( 600, 32, 32 ),
				outerSphereMesh = new THREE.MeshBasicMaterial({ 
					color: "#FFD700",
					wireframe: true
				}),	
		    	outerSphere = new THREE.Mesh(outerSphereGeom, outerSphereMesh),
		    	outerSphereVertices = outerSphere.geometry.vertices;

		    for (var i = outerSphereVertices.length - 1; i >= 0; i--) {
		    	Obj.outerSphereVerticesArray.push(outerSphereVertices[i]);
		    }
		},

		addAllBalls: function(){
			Obj.ballObject.name = "sphereObject";
			Obj.ballObject.position.set(1000,0,300);
			Obj.scene.add(Obj.ballObject);

			for (var i = Obj.outerSphereVerticesArray.length - 1; i >= 0; i--) {
				Obj.addBall(Obj.outerSphereVerticesArray[i], i);
			}

		},

		addBall: function(pos, i){
			var sphereGeom = new THREE.SphereGeometry ( 12, 15, 15 ),
				sphereMesh = new THREE.MeshPhongMaterial({ 
				color: "#FFD700",
				bumpMap: Obj.bMap,
				displacementMap: Obj.bMap,
				displacementScale: 1.0,
				// specular: "#FFD700",
				// shininess: 10,
				// wireframe: true,
				// map: brushedMetalTexture,
				// bumpMap: logoBumpMap,
			}),
		    sphere = new THREE.Mesh(sphereGeom, sphereMesh); 
		    sphere.position.set(Math.random() * (window.innerWidth*0.01) + window.innerWidth, Math.random() * (-window.innerHeight - window.innerHeight) + window.innerHeight, Math.random() * (-5000 - 5000) + 5000);
		    sphere.name = "sphere"+i;

		    sphere.position.set(pos.x, pos.y, pos.z);
		    Obj.scene.getObjectByName("sphereObject").add(sphere);
		    
		    // var	sphereTween = new TWEEN.Tween(sphere.position)
		    //                 .to({x: pos.x, y: pos.y, z: pos.z}, 6000)
		    //                 .onComplete(Obj.scene.getObjectByName("sphereObject").add(sphere))
		    //                 .start();
					
		},

		mouseListener: function(){
			document.addEventListener("mousemove", function(e){
				let lightTween = new TWEEN.Tween(Obj.scene.getObjectByName("directionalLight").position)
			                    .to({x: -event.clientX, y: -event.clientY}, 200)
			                    .easing(TWEEN.Easing.Quadratic.In)
			                    .start();
			});
		},

		animate: function(){
			requestAnimationFrame( Obj.animate );
			Obj.renderer.render( Obj.scene, Obj.camera );
			Obj.scene.getObjectByName("sphereObject").rotation.y += 0.00075;
			// Obj.controls.update();  // Debugging 3D
			TWEEN.update();
		}
		
	}

	UI.registeredCheck();
	UI.menuListener();
	UI.formListener();
	Obj.init();
	Obj.addOuterSphere();
	Obj.addAllBalls();
	Obj.addCircleBackground();
	Obj.addLighting();
	Obj.mouseListener();
	Obj.resizeListener();
	Obj.animate();

});