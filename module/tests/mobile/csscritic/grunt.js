/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg:'<json:package.json>',
        meta:{
            bannerAllInOne:'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>, Copyright (c) 2012 ThoughtWorks, Inc.;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */' +
                '\n/* Integrated dependencies:\n' +
                ' * URI.js (MIT License/GPL v3),\n' +
                ' * cssParser.js (MPL 1.1/GPL 2.0/LGPL 2.1),\n' +
                ' * htmlparser.js,\n' +
                ' * imagediff.js (MIT License),\n' +
                ' * rasterizeHTML.js (MIT License) */',
            bannerPhantomjs:'/*! PhantomJS regression runner for <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>, Copyright (c) 2012 ThoughtWorks, Inc.;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */' +
                '\n/* Integrated dependencies:\n' +
                ' * jsSHA.js (BSD License),\n' +
                ' * URI.js (MIT License/GPL v3),\n' +
                ' * cssParser.js (MPL 1.1/GPL 2.0/LGPL 2.1),\n' +
                ' * htmlparser.js,\n' +
                ' * imagediff.js (MIT License),\n' +
                ' * rasterizeHTML.js (MIT License) */'
        },
        lint:{
            src:['src/*.js'],
            grunt:'*.js',
            test:['test/*Spec.js', 'test/gruntpath.js'],
            testForPhantom:['test/helpers.js', 'test/run-phantomjs-tests.js', 'test/*SpecForPhantom.js', 'test/phantomjs-regressionrunner.js']
        },
        jasmine:{
            src:['components/rasterizeHTML.js/dist/rasterizeHTML.allinone.js', 'lib/*.js', 'src/utils.js', 'src/phantomjsrenderer.js', 'src/browserrenderer.js', 'src/domstorage.js', 'src/<%= pkg.name %>.js', 'src/basichtmlreporter.js', 'src/terminalreporter.js', 'src/signoffreporter.js'],
            specs:'test/*Spec.js',
            helpers:['test/helpers.js', 'test/lib/*.js', 'test/gruntpath.js'],
            timeout:10000,
            fixturesPath:'./fixtures/'
        },
        concat:{
            "phantomjs": {
                src:['<banner:meta.bannerPhantomjs>', 'src/utils.js', 'lib/sha256.js', 'components/rasterizeHTML.js/dist/rasterizeHTML.allinone.js', 'lib/imagediff.js', 'src/phantomjsrenderer.js', 'src/filestorage.js', '<file_strip_banner:src/<%= pkg.name %>.js>', 'src/signoffreporter.js', 'src/terminalreporter.js', 'src/htmlfilereporter.js', 'src/phantomjs_runner.js'],
                dest:'dist/<%= pkg.name %>-phantom.js'
            },
            "server": {
                src:['components/rasterizeHTML.js/dist/rasterizeHTML.allinone.js', 'src/phantomjs_render_backend.js'],
                dest:'dist/<%= pkg.name %>-server.js'
            }
        },
        min:{
            allinone: {
                src:['<banner:meta.bannerAllInOne>', 'components/rasterizeHTML.js/dist/rasterizeHTML.allinone.js', 'lib/imagediff.js', 'src/utils.js', 'src/browserrenderer.js', 'src/domstorage.js', '<file_strip_banner:src/<%= pkg.name %>.js>', 'src/basichtmlreporter.js'],
                dest:'dist/<%= pkg.name %>.allinone.js'
            }
        },
        cssmin:{
            dist:{
                src:['src/basichtmlreporter.css'],
                dest:'dist/<%= pkg.name %>.min.css'
            }
        },
        csslint: {
            basichtmlreporter: {
                src: 'src/basichtmlreporter.css',
                rules:{
                    "ids":false,
                    "adjoining-classes":false,
                    "box-model":false
                }
            }
        },
        watch:{
            files:'<config:lint.files>',
            tasks:'lint jasmine'
        },
        jshint:{
            options:{
                curly:true,
                eqeqeq:true,
                immed:true,
                latedef:true,
                newcap:true,
                noarg:true,
                undef:true,
                unused:true,
                eqnull:true,
                trailing: true,
                browser:true,
                sub:true
            },
            src:{
                globals:{
                    rasterizeHTML:true,
                    rasterizeHTMLInline:true,
                    jsSHA:true,
                    imagediff:true,
                    phantom:true,
                    console:true,
                    require:true,
                    csscritic:true
                }
            },
            test:{
                globals:{
                    "$":true,
                    jasmine:true,
                    describe:true,
                    it:true,
                    beforeEach:true,
                    afterEach:true,
                    waitsFor:true,
                    runs:true,
                    expect:true,
                    spyOn:true,
                    setFixtures:true,
                    readFixtures:true,
                    rasterizeHTML:true,
                    imagediff:true,
                    csscritic:true,
                    ifNotInWebkitIt:true,
                    safeLog:true,
                    csscriticTestPath:true,
                    csscriticTestHelper:true
                }
            },
            testForPhantom:{
                globals:{
                    phantom:true,
                    require:true,
                    localserver:true,
                    "$":true,
                    jasmine:true,
                    describe:true,
                    it:true,
                    beforeEach:true,
                    afterEach:true,
                    waitsFor:true,
                    waits:true,
                    runs:true,
                    expect:true,
                    spyOn:true,
                    imagediff:true,
                    csscritic:true,
                    safeLog:true,
                    csscriticTestPath:true,
                    csscriticTestHelper:true
                }
            }
        },
        uglify:{}
    });

    grunt.loadNpmTasks('grunt-jasmine-runner');
    grunt.loadNpmTasks('grunt-css');

    // Default task.
    grunt.registerTask('default', 'lint csslint jasmine concat min cssmin');

};
