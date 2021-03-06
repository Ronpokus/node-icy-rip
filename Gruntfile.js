var path = require('path');
var fs = require('fs');

var targetFolder = 'deploy';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            clean: path.join(targetFolder, '/**/*'),
            options: {
                'no-write': false
            }
        },

        copy: {
            main: {
                files: [
                    { expand: true, src: ['README.md', 'LICENSE'], dest: targetFolder },
                    { expand: true, flatten: true, src: ['build/*'], dest: targetFolder },
                    { expand: true, cwd:'scripts', src: ['follow-redirects/**'], dest: path.join(targetFolder, 'lib') },
                ],
            },
        },

        typescript: {
            base: {
                src: 'scripts/*.ts',
                dest: path.join(targetFolder, 'lib'),
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    rootDir: 'scripts',
                    declaration: false,
                    references: [
                        'scripts/**/*.d.ts'
                    ]
                }
            }
        },

        removeDevDeps: {
            src: ['.', targetFolder],
        },
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerMultiTask('removeDevDeps', '', function () {
        var ps = 'package.json';
        var src = JSON.parse(String(fs.readFileSync(path.join(this.data[0], ps))));
        delete src.devDependencies;
        fs.writeFileSync(path.join(this.data[1], ps), JSON.stringify(src));
    });

    grunt.registerTask('default', ['clean', 'typescript', 'copy', 'removeDevDeps']);

};