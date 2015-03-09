module.exports = function(grunt, options) {

    return {
        mockjs: {
            files: [{
                expand: true,
                filter: 'isFile',
                cwd: '<%= src %>',
                src: '**/*.jade',
                dest: '<%= temp %>'
            }],
            options: {
                replacements: [{
                    pattern: /\/\/\-@mockjs( )+/gi,
                    replacement: ''
                }]
            }
        }
    };
};
