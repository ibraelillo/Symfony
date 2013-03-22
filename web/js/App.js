/**
 * Created with JetBrains PhpStorm.
 * User: Ibrael
 * Date: 15/03/13
 * Time: 17:40
 * To change this template use File | Settings | File Templates.
 */

var App = App || {};
App.collection = null;
App.router = null;
App.getActiveCollection= function(){
    if(this.collection == null){
        this.collection = new App.Gites();
    }
    return this.collection;
};
App.loading = function(el){
    new App.LoadingView({ el: $(el)}).render();
};

App.loaded = function(){
    new App.LoadingView().destroy();
};


App.init = function(){

    new App.NavbarView();

    this.getActiveCollection().on('request', this.loading, this);
    this.getActiveCollection().on('sync', this.loaded, this);


    this.getActiveCollection().fetch({
        success: function(collection, response, options){
            this.router = new App.Router({ collection: this.collection });
            Backbone.history.start({root: '/'});
        }
    });
};

// modelos
App.Tarifa = Backbone.Model.extend();
App.Gallery = Backbone.Model.extend();
App.Reservacion = Backbone.Model.extend({
    schema: {
        Titre:         { type: 'Select', options: ['Mr', 'Mrs', 'Ms'], help: 'Test de help' },
        nombre:         'Text',
        email:          { validators: ['required', 'email'] },
        telefono:       'Text',
        capacidad:      { type: 'Text'},
        confirmada:     { type: 'Checkbox'}

    },
   urlRoot: function(){
       return this.get('url') ? this.get('url') : this.collection.url + (this.isNew() ? 'create' : 'update');
   }
});
App.Location = Backbone.Model.extend({
    reservaciones: null,
    initialize: function(){
        this.reservaciones = new App.ReservacionesCollection([],{ url: this.get('reservacionesUrl')});
        if(this.get('capacidad') > 1 && this.get('capacidad') < 6)
            this.set('clasif', 'lite');
        else if (this.get('capacidad') >= 5 && this.get('capacidad') < 9)
            this.set('clasif', 'standard');
        else
            this.set('clasif', 'pro');

    },
    defaults: {
        reservaciones: [],
        cocina: true,
        piscina: true,
        clasif: 'standard'
    },
    urlRoot: function(){
        return this.get('url') ? this.get('url') : this.collection.url + this.get('id');
    }
});


// colleciones
App.ReservacionesCollection = Backbone.Collection.extend({
    model: App.Reservacion,
    initialize: function(models, options){
        this.url = options.url;
    }
})
App.Gites = Backbone.Collection.extend({
    model: App.Location,
    url: App.Settings.urlLocations,
    findOneBySlug: function(slug){
        return this.where({ slug: slug})[0];
    }
});

// Views
App.Form = Backbone.Form.extend({
   initialize: function(options){
       Backbone.Form.prototype.initialize.call(this, options);

       this.model.on('change', this.reload, this);
   },
   events: {
       'submit': 'submit'
   },
   submit: function(e){
       e.preventDefault();
       var errors = this.commit({ validate: true });

       console.log(this.collection.toJSON());
       //if(errors)
       if(this.collection){
            this.collection.create(this.model);
       }
       else
           this.model.save();

       console.log('submit');
   },
   reload: function(){
       this.setValue(this.model.toJSON());
   }

});


App.View = Backbone.View.extend({
   destroy: function(){
       this.$el.empty();
       this.stopListening();
       return this;
   }
});
// vista para el indicador de carga de ajax
App.LoadingView = App.View.extend({
    initialize: function(){
        this.el = undefined != this.el  ? $(this.el) : $(App.container);
        //this.message = options.message;
    },
    render: function(){
        console.log("Loading...");

        $("<div/>").attr({ id: 'overlay'}).html(
            '<img id="img-load" src="'+ App.Settings.ajax_loader +'" />'
        ).appendTo('body');


        $("#overlay").css({
            opacity : 0.5,
            top     : this.el.offset().top,
            width   : this.el.outerWidth(),
            height  : this.el.outerHeight()
        });

        $("#img-load").css({
            top  : (this.el.height() / 2),
            left : (this.el.width() / 2),
            display: 'block'
        });

        $("#overlay").fadeIn();
    },
    destroy: function(){
        console.log('Loaded!');
        $("#overlay").fadeOut().remove();
        //this.remove();
    }
});


/************ portada *****************************/
App.ItemView = Backbone.View.extend({
    'tagName': 'div',
    'className': '',
    //template: _.template($('#location-features').html()),
    initialize: function() {
        _.bindAll(this);

        this.model.on('change', this.render, this);
        this.model.on('destroy', this.destroy, this);

        this.el = $(this.el);

        this.tagName = this.options.tagName ? this.options.tagName : 'div';
        this.className = this.options.className ? this.options.className : '';

        if(this.options.template_name)
            this.template = _.template($(this.options.template_name).html());

    },
    destroy: function(){
        _.unbind(this);
    },
    render:function () {
        if(!this.options.template_name)
            console.log("No se ha definido una plantilla para esta vista");
        else
            this.el.html(this.template(this.model.toJSON()));

        return this;
    }
});
App.SliderView = App.View.extend({
    initialize:function () {
        this.el = $(this.el);

        this.collection.on("reset", this.render, this);
        this.collection.on('change', this.render, this);
        this.collection.on("add", this.render, this);
    },
    render: function(){
        this.el.html("");
        var row = $('<div/>').addClass('carousel-inner');

        var  i = 0;
        _.each(this.collection.models, function (model) {
            row.append((new App.ItemView({
                model: model,
                collection: this.collection,
                template_name: "#location-slide",
                tagName: 'div',
                className: ( i == 0 ? 'active ': '') +'item slide'+(i+1)
            }).render().el));
            i++;
        }, this);
        var container = $('<div/>').addClass('container').append(
            '<div class="row animated fadeInDown">' +
            '   <div class="span12">' +
            '       <div id="myCarousel" class="carousel slide"></div>' +
            '       <a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
            '       <a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
            '   </div>' +
            '</div>'
        );
        this.el.append(container);



        $('#myCarousel').append(row).carousel('cycle', { interval: 7500 });

        $('#myCarousel').bind('slide', function(e) {
            //new flux.slider('div.item.active .flux').stop();
        });
        $('#myCarousel').bind('slid', function(e) {
            /*new flux.slider('div.item.active .flux', {
                delay: 2500
            }).start();
            */
        });


        return this;
    }
});
App.FeaturesView = App.View.extend({
    initialize:function () {
        this.el = $(this.el);
        this.collection.on("reset", this.render, this);
        this.collection.on('change', this.render, this);
        this.collection.on("add", this.render, this);
        //if(this.collection.length <= 0)
        //this.populate();
    },
    render: function() {
        this.el.html("");
        var container = $('<div/>').addClass('container').append(
            '<h2 class="section_header"><hr class="left visible-desktop"><span>Locations '+
                (this.collection.length > 3 ? '<small>' + (this.collection.length - 3) + ' plus sont disponibles.</small>':'') +
            '</span><hr class="right visible-desktop"></h2>'
        );

        this.el.append(container.hide().fadeIn('slow'));

        var row = $('<div/>').attr('id', "rowFeatures").addClass('row');

        container.append(row.hide().fadeIn('slow'));

        var  i = 0;
        _.each(this.collection.models, function (model) {
            if(i++ >= 3) return;
            row.append((new App.ItemView({
                model: model,
                collection: this.collection,
                template_name: "#location-features",
                tagName: 'div',
                className: 'span4 feature'
            })).render().el.hide().fadeIn(2000, 'linear'));
        }, this);
        return this;
    }
});
App.PricesView = App.View.extend({
    initialize: function(){
        _.bindAll(this);

        this.el = $(this.el);

        this.collection.on('reset', this.render, this);
        this.collection.on('change', this.render, this);
    },
    render: function(){
        this.el.html("");
        var container = $('<div/>').addClass('container').append(
            '<h2 class="section_header">' +
                '<hr class="left visible-desktop">' +
                '<span>Prix</span>' +
                '<hr class="right visible-desktop">' +
                '</h2>'
        );

        this.el.append(container.hide().fadeIn('slow'));
        var row = $('<div/>').addClass('row');
        container.append(row.hide().fadeIn('slow'));

        var copy = this.collection.slice(0,3);
        copy.push(copy.shift());
        copy.push(copy.shift());

        _.each(copy, function (model) {
            row.append((new App.ItemView({
                model: model,
                collection: this.collection,
                template_name: "#location-pricing",
                className: 'span4'
            })).render().el.hide().fadeIn(2000, 'linear'));
        }, this);
        return this;
    }
});
App.PortadaView = App.View.extend({
    initialize:function () {
        this.el = $(this.el);
        _.bindAll(this);

        //this.collection = new App.Gites();

        this.collection.on("destroy", this.destroy, this);
        this.collection.on("request", this.loading, this);
        this.collection.on("sync", this.loaded, this);
        //this.collection.on("sync", this.updateView, this);

        this.render();
        this.updateView();
        //this.collection.fetch();
    },
    updateView: function(){
        new App.SliderView({ collection: this.collection, el: $("#hero")}).render();
        new App.FeaturesView({ collection: this.collection, el: $("#features") }).render();
        new App.PricesView({ collection: this.collection, el: $("#pricing")}).render();
    },
    render: function(){
        this.el.html("");
        $('<div/>').attr('id','hero').appendTo(this.el);
        this.el.append('<div id="intro"><div class="container"><h1>...vos vacances toute l\' ann&eacute;e à prix canons! </h1></div></div>');
        $('<div/>').attr('id','features').appendTo(this.el);
        $('<div/>').attr('id','pricing').appendTo(this.el);

        return this;
    }
});
/************* fin de la portada *****************************/


/************* todas las locationes **************************/
App.SidebarView = App.View.extend({
    initialize: function(){
        _.bindAll(this);
        this.el = $(this.el);

        if(this.collection == null && this.model.collection != null)
            this.collection = this.model.collection;

        this.el = $('<div/>').addClass(this.className);
    },
    render: function(){
        var buscador = '<input type="text" class="input-large search-query" placeholder="Chercher">';

        var section;

        var secciones = new Array();

        if(this.model.collection != null){
            var that = this;
            section =    '<h4 class="sidebar_header">Autres locations</h4><ul class="sidebar_menu">';
            _.each(this.collection.models, function(model){
                if(that.model.id != model.id)
                    section += '   <li><a href="#!/location/'+ model.get('slug')+'">'+ model.get('nombre')+'</a></li>';
            });

            section +=     '</ul>';
            secciones.push(section);
        }


        this.el.append( buscador);
        var self = this;
        _.each(secciones, function(sec){
           self.el.append(sec);
        });
        /*        '<h4 class="sidebar_header">Recent posts</h4>' +
                '    <ul class="recent_posts">' +
                '        <li>' +
                '           <div class="row">' +
                '               <div class="span1">' +
                '                   <a href="blog-post.html">' +
                '                       <img class="thumb" alt="thumb post" src="img/pic_blog.png" />' +
                '                   </a>' +
                '               </div>' +
                '                <div class="span2">' +
                '                   <a class="link" href="blog-post.html">Suspendisse Semper Ipsum</a>' +
                '                </div>' +
                '            </div>' +
                '        </li>'+
                '</ul>' +
                '  </div>'*/
        //);
        return this;
    }
});
App.ReservationView = Backbone.View.extend({
    initialize: function(){
        _.bindAll(this);

        this.el = $(this.el);

        console.log(this.collection.toJSON());

        this.collection.on('reset', this.addAll, this);
        this.collection.on('add', this.addOne, this);
        this.collection.on('change', this.change, this);
        this.collection.on('destroy', this.destroy, this);
        this.collection.on('request', function(e){
            new App.LoadingView({ el: $(this.el) }).render();
        }, this);
        this.collection.on('sync', function(e){
            new App.LoadingView({ el: $(this.el) }).destroy();
        }, this);

        this.collection.fetch();
    },
    render: function(){
        this.el.fullCalendar({
            header: {
                left: 'title',
                right: 'prev,next',
                ignoreTimezone: false
            },
            selectable: true,
            selectHelper: true,
            select: this.select,
            eventDataTransform: this._transform

        });
    },
    _transform: function(event){
        return {
            id: event.id,
            start: event.fecha_entrada,
            end: event.fecha_salida,
            title: 'Non disponible',
            color: 'white',
            backgroundColor: function() {
                return event.get('email') == ( App.User.email != undefined ? App.User.email : '@')
                    ? 'green' : '#0088CC';
            }
        }
    },
    destroy: function(event){
        this.el.fullCalendar('removeEvents', event.id);
    },
    eventDropOrResize: function(fcEvent){

    },
    change: function(event){
        var fcEvent = this.el.fullCalendar('clientEvents', event.get('id'))[0];
        this.el.fullCalendar('updateEvent', fcEvent);
    },
    eventClick: function(fcEvent) {
        //this.eventView.model = this.collection.get(fcEvent.id);
        //this.eventView.render();
    },
    select: function(start, end){

        //console.log(start, end);
        var unavailable = false;
        var self = this;

        if(start <= Date.now() || end <= Date.now()){
            this.el.fullCalendar('unselect');
            return alert('debe escoger una fecha de hoy en adelante!');
        }

        _.each(this.collection.models, function(model){
            model_start = $.fullCalendar.parseDate(model.get('fecha_entrada'));
            model_end = $.fullCalendar.parseDate(model.get('fecha_salida'));

            var overlap = Math.max(0, Math.min(model_end.getTime(), end.getTime()) - Math.max(model_start.getTime(), start.getTime()));


            unavailable = unavailable || (overlap > 0);
        });

        if(unavailable){
            alert('Imposible de selectioner ce rangue de dates parce il est sur le rangue d\'autres réserves ');
            this.el.fullCalendar('unselect');
        }else{
            this.model.set({
                fecha_entrada: $.fullCalendar.formatDate(start, 'yyyy-MM-dd hh:mm:ss'),
                fecha_salida: $.fullCalendar.formatDate(end, 'yyyy-MM-dd hh:mm:ss')
            });

            console.log(this.model.toJSON());
            //this.addOne(this.model);
        }
    },
    addAll: function(){
        console.log(this.collection.toJSON());
        // agregando los eventos al calendario
        this.el.fullCalendar('addEventSource', this.collection.toJSON());
    },
    addOne: function(event){
        event.set({ backgroundColor: "#0088CC", color: "white"});
        this.el.fullCalendar('renderEvent', event.toJSON(), true);
    }
});

App.LocationsView = App.View.extend({
    initialize: function(){
        _.bindAll(this);
        this.el = $(this.el);

        this.collection.on('change', this.render, this);
        this.collection.on('reset', this.render, this);

        //this.collection.fetch();

        this.render();
    },
    render: function(){
        var row = $('<div/>').addClass('span8');

        _.each(this.collection.models, function(model){
            row.append(
                new App.ItemView({
                    model: model,
                    collection: this.collection,
                    template_name: "#location-preview",
                    tagName: 'div',
                    className: 'post'
                }).render().el
            );
        });



        this.el.html("").append(
            '<div id="blog_wrapper">' +
            '   <div class="container">' +
            '       <div class="row">' +
            '           <div class="span8">' +
            '               <h1 class="header">Locations <hr></h1>'+
                            row.html() +
            '           </div>' +
                new App.SidebarView({
                    model: this.collection.at(0),
                    collection: this.collection,
                    className: 'span3 sidebar offset1'
                }).render().el.html() +
            '       </div>' +
            '   </div>' +
            '</div>'
        );
    }
});


App.LocationDetailView = Backbone.View.extend({
   initialize: function(){
       _.bindAll(this);
       this.el = $(this.el);
       this.model.on('change', this.render, this);
       this.model.on('reset', this.render, this);
       this.render();
   },
   render: function(){
       var row = $('<div/>').addClass('span8').append(
           new App.ItemView({
               model: this.model,
               template_name: '#location-detail'
           }).render().el
       );

       var reservacion = new App.Reservacion({
           //title: 'Ma réservation',
           fecha_entrada: '',
           fecha_salida: '',
           capacidad: 1
       });

       //this.model.reservaciones.add(reservacion);



       this.el.html("").append(
           '    <div class="container" id="portfolio">' +
           '         <h2 class="section_header left"><span>'+ this.model.get('nombre')+' </span><hr class="right visible-desktop"> </h2>' +
           '        <div class="row-fluid">'+
                  '    <ul class="nav nav-pills">' +
                   '        <li class="active"><a href="#tab1" data-toggle="tab"><i class="icon-calendar"></i> R&eacute;server</a></li>' +
                   '        <li><a href="#tab2" data-toggle="tab"><i class="icon-info-sign"></i> Plus d\' info</a></li>' +
                   '        <li><a href="#tab3" data-toggle="tab"><i class="icon-camera"></i> Photos</a></li>' +
                   '    </ul>' +
                   '    <div class="tab-content">' +
                   '        <div class="tab-pane active" id="tab1">' +
                   '            <div id="calendar" class="span7"></div>' +
                   '            <div id="res-form" class="span4"></div> '+
                   '        </div>' +
                   '        <div class="tab-pane" id="tab2"></div>' +
                   '        <div class="tab-pane" id="tab3"></div>' +
                   '    </div>' +
           '       </div>' +
           '   </div>'
       );


       new App.ItemView({
           model: this.model,
           template_name: '#location-detail',
           el: $('#tab2')
       }).render()

       new App.ReservationView({
           collection: this.model.reservaciones,
           model: reservacion,
           el: $('#calendar')
       }).render();

       $('#res-form').append(
           new App.Form({
               model: reservacion,
               collection: this.model.reservaciones
           }).render().el
       );
       //$('#myCarousel').carousel('cycle');

       new App.ItemView({ template_name: '#portfolio', model: this.model, el: $('#tab3') }).render();

       return this;
   }
});



/***************navbar *****************************/
App.NavbarView = Backbone.View.extend({
    el: $('body'),
    initialize: function(){
        this.el = $(this.el);

        this.render();
    },
    render: function(){
        this.el.prepend(
            '<a href="#" class="scrolltop"><span>up</span></a>' +
                '<div class="navbar navbar-fixed-top" id="barra">' +
                '    <div class="navbar-inner">' +
                '        <div class="container">' +
                '           <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">' +
                '              <span class="icon-bar"></span>' +
                '              <span class="icon-bar"></span>' +
                '              <span class="icon-bar"></span>' +
                '           </a>' +
                '           <a class="brand scroller" data-section="body" href="#!/home">' +
                '               <img src="'+ App.Settings.logo +'" alt="logo" />' +
                '           </a>' +
                '           <div class="nav-collapse collapse">' +
                '                <ul class="nav pull-right">' +
                '                   <li><a href="#!/locations" class="scroller" data-section="#home">Locations</a></li>' +
                '                   <li><a href="#!/contact" class="scroller" data-section="#footer">Nous</a></li>  ' +
                '                   <li><a class="btn-header" href="#!/signup">S\' enregistrer</a></li>' +
                '                   <li><a class="btn-header" href="#!/signin">Entrer</a></li>' +
                '                </ul>' +
                '             </div>' +
                '        </div>' +
                '    </div>' +
                '</div>'
        );
    }
});



App.Router = Backbone.Router.extend({

    viewActive: null,
    routes: {
        '': 'homeAction',
        '/': 'homeAction',
        '!/home' : 'homeAction',
        '!/contact': 'contactAction',
        '!/location/:slug': 'locationAction',
        '!/location/:slug/reservar': 'reservarAction',
        '!/locations' : 'allAction'
    },

    clearView: function(){
        if(this.viewActive instanceof App.View)
            this.viewActive.destroy();

        return this;
    },

    reservarAction: function(slug){
        var model = App.getActiveCollection().findOneBySlug(slug);
        console.log(model);

        var self = this;
        model.fetch({
            success: function(model, response, xhr){
                self.clearView().viewActive = new App.ReservationView({
                    collection: model.reservaciones,
                    el: $(App.container)
                }).render();
            }
        });
    },
    homeAction: function(){
        this.clearView().viewActive = new App.PortadaView({
            collection: App.collection,
            el: $(App.container)});
    },
    contactAction: function(){
        alert('contact');
    },

    allAction: function(){
        this.clearView().viewActive= new App.LocationsView({
            el: $('#content'),
            collection: App.getActiveCollection()
        });
    },

    locationAction: function(slug){

        var model = App.getActiveCollection().findOneBySlug(slug);
        var self = this;
        model.fetch({
            success: function(model, response, xhr){
                console.log(model);

                self.clearView().viewActive= new App.LocationDetailView({
                    model: model,
                    collection: App.getActiveCollection(),
                    el: $(App.container)
                });
            }
        })

    }
});