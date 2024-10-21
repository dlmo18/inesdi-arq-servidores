const Employee = require('../models/Employee');

const employeeCtr = {

    'total': (req, res) => {
        const result = {
            'status':   true,
            'data'  :   {
                'employees': Employee.list().length
            }
        };
        res.json(result);
    },

    'list': ( req, res ) => {
        let query = req.query;
        let params = req.params;
        
        let data = Employee.list((elem, index) => {
            let filter = true;

            if (query && query.page) {
                const page = parseInt(query.page);

                if (isNaN(page)) {
                    throw new Error("La página debe ser tipo numérica");
                }

                const pageSize = 2;
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;

                if (startIndex > index || endIndex <= index) {
                    filter = false;
                }
            } else if (query && query.user && elem.privileges != 'user') {
                filter = false;
            } else if (query && query.badges && elem.badges.indexOf(query.badges) == -1) {
                filter = false;
            } else if(params && params.name && params.name != elem.name) {
                filter = false;
            }

            return filter;
        });

        if( req.originalUrl.indexOf('/oldest')>=0 ) {
             let oldest = null;
             data.forEach(element => {
                if( !oldest || element.age>oldest.age  ) {
                    oldest = element;                    
                }
             });
             data=oldest;
        }

        const result = {
            'status':true,
            'length': data.length,
            'data': data
        };

        if ( req.params.name && data.length==0 ) {            
            res.status(404).json({
                "code": "not_found"
            });
        }
        else {
            res.json(result);
        }

    },

    'add': ( req, res ) => {
        //validar contenido
        const data = req.body;
        let error =  null;

        if( !data.name || data.name=='' ){
            error = "Nombre inválido";
        }
        else if( !data.age || isNaN(data.age) ){
            error = "Edad inválida";
        }
        else if( !data.phone ){
            error = "Teléfonos requeridos";
        }
        else if( !data.privileges || ['admin','user'].indexOf(data.privileges)==-1  ){
            error = "Privilegios son requeridos (admin o user)";
        }
        else if( !data.favorites ){
            error = "Favoritos son requeridos";
        }
        else if( !data.finished ){
            error = "Finished son requeridos";
        }
        else if( !data.badges ){
            error = "Badges son requeridos";
        }
        else if( !data.points ){
            error = "Puntos son requeridos";
        }

        if(error) {
            res.status(400).json({
                "code": "bad_request",
                "message": error 
            });
        }
        else {
            const result = {
                'status':true,
                'data': Employee.add(data)
            };
            res.json(result);
        }

    }

};

module.exports = employeeCtr;