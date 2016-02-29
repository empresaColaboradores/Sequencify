var fs = require('fs');
var config = require('./config/config');
var filter = require('./config/filter');
var chokidar = require('chokidar');

function GenerateSequences(FILE_NAME) {
  fs.readFile(FILE_NAME, 'utf8', function(err, xml){
      if(err) throw err;

      if(xml.indexOf('param') === -1) {
        var generatorPos = xml.indexOf('generator');

        if(generatorPos){
          var before = xml.slice(0, generatorPos-1);
          
          var columnTagStart = before.indexOf('<column name="');
          var columnTagEnd = columnTagStart;
          while(before.substring(columnTagEnd) != " ") columnTagEnd++;

          var column = before.slice(columnTagStart, columnTagEnd);
          var name = column.split(" ")[1].split("name=")[1].split('"')[1];

          var SequenceName = name.split("COD")[1] + '_SEQ';
          var generator = '<generator class="com.hseq.data.OracleSequenceGenerator">\n\t\t\t\t<param name="sequence"> ' + SequenceName + ' </param>\n\t\t\t</generator>';

          var FILE_CONTENT = before + generator + xml.slice(generatorPos + 57 , xml.length);

          var Entity = FILE_NAME.split("/")[1];

          fs.writeFile( config.path + '/' + Entity, FILE_CONTENT, function (err) {
            if (err) return console.log(err);
            console.log(Entity, 'Fixed');
          });
        }
      }
  });
}

function Sequencify() {
  var xmls = filter();
  
  for (var i = 0; i < xmls.length; i++) 
    GenerateSequences(xmls[i]);
}

if(process.argv[2] == '--watch') {
  var watcher = chokidar.watch(config.input, { persistent: true });

  watcher.on('change', function(path) {
    Sequencify(config.input);
  });
} else {
  var watcher = chokidar.watch(config.input, { persistent: false });
  Sequencify(config.input);
}