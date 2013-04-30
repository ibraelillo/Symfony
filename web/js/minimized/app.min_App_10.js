var App=App||{};App.collection=null;App.router=null;App.getActiveCollection=function(){if(this.collection==null){this.collection=new App.Gites()}return this.collection};App.loading=function(a){new App.LoadingView({el:$(a)}).render()};App.loaded=function(){new App.LoadingView({}).destroy()};App.init=function(){new App.NavbarView();this.getActiveCollection().on("request",this.loading($(App.container)),this);this.getActiveCollection().on("sync",this.loaded,this);this.getActiveCollection().fetch({success:function(c,a,b){this.router=new App.Router({collection:this.collection});Backbone.history.start({root:"/"})}})};App.Tarifa=Backbone.Model.extend();App.Gallery=Backbone.Model.extend();App.Reservacion=Backbone.Model.extend({schema:{title:{type:"Select",title:"Titre",options:["M.","Mdme"],validators:["required"]},nombre:{type:"Text",title:"Nom et prenom",validators:["required"]},email:{validators:["required","email"],title:"Adresse email"},telefono:{type:"Text",title:"Tel"},capacidad:{type:"Text",title:"Capacité",validators:["required"]},confirmada:{type:"Checkbox",title:"Confirmé"}},urlRoot:function(){return this.get("url")?this.get("url"):this.collection.url+(this.isNew()?"create":"update")}});App.Location=Backbone.Model.extend({reservaciones:null,initialize:function(){this.reservaciones=new App.ReservacionesCollection([],{url:this.get("reservacionesUrl")});if(this.get("capacidad")>1&&this.get("capacidad")<6){this.set("clasif","lite")}else{if(this.get("capacidad")>=5&&this.get("capacidad")<9){this.set("clasif","standard")}else{this.set("clasif","pro")}}},defaults:{reservaciones:[],cocina:true,piscina:true,clasif:"standard"},urlRoot:function(){return this.get("url")?this.get("url"):this.collection.url+this.get("id")}});App.ReservacionesCollection=Backbone.Collection.extend({model:App.Reservacion,initialize:function(b,a){this.url=a.url}});App.Gites=Backbone.Collection.extend({model:App.Location,url:App.Settings.urlLocations,findOneBySlug:function(a){return this.where({slug:a})[0]}});App.Form=Backbone.Form.extend({initialize:function(a){Backbone.Form.prototype.initialize.call(this,a);this.model.on("change",this.reload,this)},events:{submit:"submit"},submit:function(a){a.preventDefault();var b=this.commit({validate:true});console.log(this.collection.toJSON());if(this.collection){this.collection.create(this.model)}else{this.model.save()}console.log("submit")},reload:function(){this.setValue(this.model.toJSON())}});App.View=Backbone.View.extend({destroy:function(){this.el.fadeOut().empty();this.stopListening();return this}});App.LoadingView=App.View.extend({initialize:function(a){this.el=(undefined!=a.el?$(a.el):$(App.container));console.log(this.el)},render:function(){console.log("Loading...");$("<div/>").attr({id:"overlay"}).html('<img id="img-load" src="'+App.Settings.ajax_loader+'" />').appendTo("body");var a=this;$("#overlay").css({opacity:0.5,top:a.el.offset().top,width:a.el.outerWidth(),height:a.el.outerHeight()});$("#img-load").css({top:(a.el.height()/2),left:(a.el.width()/2),display:"block"});$("#overlay").fadeIn()},destroy:function(){console.log("Loaded!");$("#overlay").fadeOut().remove()}});App.ItemView=Backbone.View.extend({tagName:"div",className:"",initialize:function(){_.bindAll(this);this.model.on("change",this.render,this);this.model.on("destroy",this.destroy,this);this.el=$(this.el);this.tagName=this.options.tagName?this.options.tagName:"div";this.className=this.options.className?this.options.className:"";if(this.options.template_name){this.template=_.template($(this.options.template_name).html())}},destroy:function(){_.unbind(this)},render:function(){if(!this.options.template_name){console.log("No se ha definido una plantilla para esta vista")}else{this.el.html(this.template(this.model.toJSON()))}return this}});App.SliderView=App.View.extend({initialize:function(){this.el=$(this.el);this.collection.on("reset",this.render,this);this.collection.on("change",this.render,this);this.collection.on("add",this.render,this)},render:function(){this.el.html("");var c=$("<div/>").addClass("carousel-inner");var b=0;_.each(this.collection.models,function(d){c.append((new App.ItemView({model:d,collection:this.collection,template_name:"#location-slide",tagName:"div",className:(b==0?"active ":"")+"item slide"+(b+1)}).render().el));b++},this);var a=$("<div/>").addClass("container").append('<div class="row-fluid animated fadeInDown">   <div class="span12">       <div id="myCarousel" class="carousel slide"></div>   </div></div>');this.el.append(a);$("#myCarousel").append(c).append('       <a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a><a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>').carousel("cycle",{interval:7500});$("#myCarousel").bind("slide",function(d){});$("#myCarousel").bind("slid",function(d){});return this}});App.FeaturesView=App.View.extend({initialize:function(){this.el=$(this.el);this.collection.on("reset",this.render,this);this.collection.on("change",this.render,this);this.collection.on("add",this.render,this)},render:function(){this.el.html("");var a=$("<div/>").addClass("container").append('<h2 class="section_header"><hr class="left visible-desktop"><span>Locations '+(this.collection.length>3?"<small>"+(this.collection.length-3)+" plus sont disponibles.</small>":"")+'</span><hr class="right visible-desktop"></h2>');this.el.append(a.hide().fadeIn("slow"));var c=$("<div/>").attr("id","rowFeatures").addClass("row");a.append(c.hide().fadeIn("slow"));var b=0;_.each(this.collection.models,function(d){if(b++>=3){return}c.append((new App.ItemView({model:d,collection:this.collection,template_name:"#location-features",tagName:"div",className:"span4 feature"})).render().el.hide().fadeIn(2000,"linear"))},this);return this}});App.AboutUsView=App.View.extend({initialize:function(){_.bindAll(this);this.el=$(this.el);this.collection.on("reset",this.render,this);this.collection.on("change",this.render,this)},render:function(){this.el.html("").append($("#about-us").html());return this}});App.PortadaView=App.View.extend({initialize:function(){this.el=$(this.el);_.bindAll(this);this.collection.on("destroy",this.destroy,this);this.collection.on("request",this.loading,this);this.collection.on("sync",this.loaded,this);this.render();this.updateView()},updateView:function(){new App.SliderView({collection:this.collection,el:$("#hero")}).render();new App.FeaturesView({collection:this.collection,el:$("#features")}).render();new App.AboutUsView({collection:this.collection,el:$("#pricing")}).render()},render:function(){this.el.html("");$("<div/>").attr("id","hero").appendTo(this.el);this.el.append('<div id="intro"><div class="container"><h1>...vos vacances toute l\' ann&eacute;e à prix canons! </h1></div></div>');$("<div/>").attr("id","features").appendTo(this.el);$("<div/>").attr("id","pricing").appendTo(this.el);return this}});App.SidebarView=App.View.extend({initialize:function(){_.bindAll(this);this.el=$(this.el);if(this.collection==null&&this.model.collection!=null){this.collection=this.model.collection}this.el=$("<div/>").addClass(this.className)},render:function(){var b='<input type="text" class="input-large search-query" placeholder="Chercher">';var d;var e=new Array();if(this.model.collection!=null){var c=this;d='<h4 class="sidebar_header">Autres locations</h4><ul class="sidebar_menu">';_.each(this.collection.models,function(f){if(c.model.id!=f.id){d+='   <li><a href="#!/location/'+f.get("slug")+'">'+f.get("nombre")+"</a></li>"}});d+="</ul>";e.push(d)}this.el.append(b);var a=this;_.each(e,function(f){a.el.append(f)});return this}});App.ReservationView=Backbone.View.extend({initialize:function(){_.bindAll(this);this.el=$(this.el);var a=this;this.collection.on("reset",this.addAll,this);this.collection.on("add",this.addOne,this);this.collection.on("change",this.change,this);this.collection.on("destroy",this.destroy,this);this.collection.on("request",function(){App.loading(a.el)},this);this.collection.on("sync",function(){App.loaded(a.el)},this);this.collection.fetch()},render:function(){this.el.fullCalendar({header:{left:"title",right:"prev,next",ignoreTimezone:false},selectable:true,selectHelper:true,select:this.select,eventDataTransform:this._transform})},_transform:function(a){return{id:a.id,start:a.fecha_entrada,end:a.fecha_salida,title:"Non disponible",color:"white",backgroundColor:function(){return a.get("email")==(App.User.email!=undefined?App.User.email:"@")?"green":"#0088CC"}}},destroy:function(a){this.el.fullCalendar("removeEvents",a.id)},eventDropOrResize:function(a){},change:function(b){var a=this.el.fullCalendar("clientEvents",b.get("id"))[0];this.el.fullCalendar("updateEvent",a)},eventClick:function(a){},select:function(d,a){var c=false;var b=this;if(d<=Date.now()||a<=Date.now()){this.el.fullCalendar("unselect");return alert("debe escoger una fecha de hoy en adelante!")}_.each(this.collection.models,function(f){model_start=$.fullCalendar.parseDate(f.get("fecha_entrada"));model_end=$.fullCalendar.parseDate(f.get("fecha_salida"));var e=Math.max(0,Math.min(model_end.getTime(),a.getTime())-Math.max(model_start.getTime(),d.getTime()));c=c||(e>0)});if(c){alert("Imposible de selectioner ce rangue de dates parce il est sur le rangue d'autres réserves ");this.el.fullCalendar("unselect")}else{this.model.set({fecha_entrada:$.fullCalendar.formatDate(d,"yyyy-MM-dd hh:mm:ss"),fecha_salida:$.fullCalendar.formatDate(a,"yyyy-MM-dd hh:mm:ss")});console.log(this.model.toJSON())}},addAll:function(){console.log(this.collection.toJSON());this.el.fullCalendar("addEventSource",this.collection.toJSON())},addOne:function(a){a.set({backgroundColor:"#0088CC",color:"white"});this.el.fullCalendar("renderEvent",a.toJSON(),true)}});App.LocationsView=App.View.extend({initialize:function(){_.bindAll(this);this.el=$(this.el);this.collection.on("change",this.render,this);this.collection.on("reset",this.render,this);this.render()},events:{"click a":function(b){var a=$(b.target);var c=a.attr("class");if(c){$("a.btn."+c).button("loading")}}},render:function(){var a=$("<div/>").addClass("span8");_.each(this.collection.models,function(b){a.append(new App.ItemView({model:b,collection:this.collection,template_name:"#location-preview",tagName:"div",className:"post"}).render().el)});this.el.html("").append('<div id="blog_wrapper">   <div class="container">       <div class="row">           <div class="span8">               <h1 class="header">Locations <hr></h1>'+a.html()+"           </div>"+new App.SidebarView({model:this.collection.at(0),collection:this.collection,className:"span3 sidebar offset1"}).render().el.html()+"       </div>   </div></div>")}});App.LocationDetailView=Backbone.View.extend({initialize:function(){_.bindAll(this);this.el=$(this.el);this.model.on("change",this.render,this);this.model.on("reset",this.render,this);this.render()},render:function(){var b=$("<div/>").addClass("span8").append(new App.ItemView({model:this.model,template_name:"#location-detail"}).render().el);var a=new App.Reservacion({fecha_entrada:"",fecha_salida:"",capacidad:1});this.el.html("").append('    <div class="container" id="portfolio">                    <h2 class="section_header left"><span>'+this.model.get("nombre")+' </span><hr class="right visible-desktop"> </h2>                   <div class="row-fluid tabbable">                    <div class="navbar">                        <div class="navbar-inner">                             <div class="container-fluid">                                 <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">                                   <span class="icon-bar"></span>                                   <span class="icon-bar"></span>                                   <span class="icon-bar"></span>                               </a>                               <div class="nav-collapse">                                    <ul class="nav nav-pills">                                       <li class="active"><a href="#tab1" data-toggle="tab"><i class="icon-calendar"></i> R&eacute;server</a></li>                                       <li><a href="#tab2" data-toggle="tab"><i class="icon-info-sign"></i> Plus d\' info</a></li>                                       <li><a href="#tab3" data-toggle="tab"><i class="icon-camera"></i> Photos <span class="badge badge-success">'+this.model.get("gallery").length+'</span> </a></li>                                       <li><a href="#tab4" data-toggle="tab"><i class="icon-facetime-video"></i> Videos <span class="badge badge-success">'+0+'</span> </a></li>                                   </ul>                               </div>                            </div>                       </div>                    </div>                       <div class="tab-content">                           <div class="tab-pane active" id="tab1">                               <div id="calendar" class="span7"></div>                               <div id="res-form" class="span4"></div>                            </div>                            <div class="tab-pane" id="tab2"></div>                           <div class="tab-pane" id="tab3"></div>                           <div class="tab-pane" id="tab4"></div>                       </div>                  </div>              </div>');new App.ItemView({model:this.model,template_name:"#location-detail",el:$("#tab2")}).render();new App.ReservationView({collection:this.model.reservaciones,model:a,el:$("#calendar")}).render();$("#res-form").append(new App.Form({model:a,collection:this.model.reservaciones}).render().el);new App.ItemView({template_name:"#portfolio",model:this.model,el:$("#tab3")}).render();return this}});App.NavbarView=Backbone.View.extend({el:$("body"),initialize:function(){this.el=$(this.el);this.render()},render:function(){this.el.prepend(_.template($("#navbar").html(),{logo:App.Settings.logo}))}});App.Signup=App.View.extend({template:_.template($("#signup").html()),initialize:function(){_.bindAll(this);this.form=App.Form.extend({schema:{email:{type:"Text",validators:["email"],required:true},password:{type:"Password",required:true},confirmation:{type:"Password",required:true},permite_email:{type:"Checkbox"}}});this.el=$(this.el)},render:function(){this.el.html(this.template());return this}});App.ContactView=App.View.extend({initialize:function(){_.bindAll(this);this.el=$(this.el)},render:function(){this.el.load(App.pages.contact);return this}});App.Router=Backbone.Router.extend({viewActive:null,routes:{"":"homeAction","/":"homeAction","!/home":"homeAction","!/contact":"contactAction","!/location/:slug":"locationAction","!/location/:slug/reservar":"reservarAction","!/locations":"allAction","!/signup":"signup"},initialize:function(){return this.bind("all",this._trackPageview)},_trackPageview:function(){var a;a=Backbone.history.getFragment();return _gaq.push(["_trackPageview","/"+a])},clearView:function(){if(this.viewActive instanceof App.View){this.viewActive.destroy().el.hide()}return this},signup:function(){this.clearView().viewActive=new App.Signup({el:$(App.container)}).render().el.fadeIn()},reservarAction:function(b){var c=App.getActiveCollection().findOneBySlug(b);var a=this;c.fetch({success:function(e,d,f){a.clearView().viewActive=new App.ReservationView({collection:e.reservaciones,el:$(App.container)}).render().el.fadeIn("slow")}})},homeAction:function(){$("document").attr("title","Accueil | "+App.title);this.clearView().viewActive=new App.PortadaView({collection:App.collection,el:$(App.container)}).el.fadeIn("slow")},contactAction:function(){this.clearView().viewActive=new App.ContactView({el:$(App.container)}).render()},allAction:function(){this.clearView().viewActive=new App.LocationsView({el:$("#content"),collection:App.getActiveCollection()}).el.fadeIn("slow")},locationAction:function(b){var c=App.getActiveCollection().findOneBySlug(b);var a=this;c.fetch({success:function(e,d,f){console.log(e);a.clearView().viewActive=new App.LocationDetailView({model:e,collection:App.getActiveCollection(),el:$(App.container)}).el.fadeIn("slow")}})}});