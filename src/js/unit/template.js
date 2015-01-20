define( "Template" , [ "Base" , "HandleBars" ] , function( Base , HandleBars ){
    /*!
     *  @tagName    {string}
     *  要求获取的tagName索引
     *  默认为kulor-template
     */
    var Template = Base.extend( function( tagName ){
        if( $.isEmptyObject( this.__Template ) ){
            this.getTemplateSources();    
        }
        this.setTemplateRuleTagName( tagName );
    } , {
        __config    : {
            ruleTagName    : "kulor-template"
        },
        __Template  : {} ,
        /*! 
         *  根据json 拼接html
         *  @json   {object}    待输入的json数据
         *  @id     {string}    模板名称
         *  return  {htmlString}
         */
        getTemplate : function( json , id ){
            if( !id ){
                id = json;
                json = {};
            } else if( !json ){
                return this;
            }
            if( !this.__Template[ id ] ){
                this.getTemplateSources();
            }
            if( this.__Template[ id ] ){
                if( !this.__Template[ id ].handleBar ){
                    this.__Template[ id ].handleBar = HandleBars.compile( this.__Template[ id ].TemplateContent );
                }
                return this.__Template[ id ].handleBar( json );
            }
            return this;
        } , 
        /*!
         *  重新录入template模板资源
         */
        getTemplateSources : function(){
            var _self = this;
            $( "script[type='text/" + _self.__config.ruleTagName + "']" ).each( function(){
                _self.__Template[ this.id ] = {
                        id              : this.id ,
                        TemplateContent : this.innerHTML ,
                        handleBar       : false
                    }; 
            } );
            return _self;
        } ,
        /*!
         *  重置模板的内容
         */
        resetTemplateContent : function( id , content ){
            if( typeof id == "string" && typeof content == "string" ){
                this.__Template[ id ] = {
                        id              : id ,
                        TemplateContent : content ,
                        handleBar       : false
                    };
            }
            return this;
        } ,
        /*!
         *  获取所有的模板信息
         */
        getTemplateIdList : function(){
            return this.__Template;
        } ,
        /*!
         *  设置模板的type 索引名称 
         *  一旦设置了tagName 后续获取template的索引为script(type="text/tagName")
         *  @tagName    {string}
         */
        setTemplateRuleTagName : function( tagName ){
            if( typeof tagName == "string" ){
                this.__config.ruleTagName = tagName;
            }
            return this;
        }
    } );
    return Template;
} );