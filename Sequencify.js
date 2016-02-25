var fs = require('fs');

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function GenerateSequences(FILE_NAME){
  fs.readFile(FILE_NAME, 'utf8', function(err, xml){
      if(err) throw err;

      if(xml.indexOf('param') === -1) {
        var generatorPos = xml.indexOf('generator');

        if(generatorPos){
          var Before = xml.slice(0, generatorPos-1);
          
          var idTagStart = Before.indexOf('<column name="');
          var idTagEnd = idTagStart;
          while(Before.substring(idTagEnd) != " ") idTagEnd++;

          var Column = Before.slice(idTagStart, idTagEnd);
          var ColumnName = Column.split(" ")[1].split("name=")[1].split('"')[1];

          var SequenceName = ColumnName.split("COD")[1] + '_SEQ';
          var Generator = '<generator class="com.hseq.data.OracleSequenceGenerator">\n\t\t\t\t<param name="sequence"> ' + SequenceName + ' </param>\n\t\t\t</generator>';

          var FILE_CONTENT = Before + Generator + xml.slice(generatorPos + 57 , xml.length);

          fs.writeFile('NEW XMLs/'+ FILE_NAME.split("OLD XMLs/")[1], FILE_CONTENT, function (err) {
            if (err) return console.log(err);
            console.log(FILE_NAME, 'FIXED');
          });
        }  
      }
  });
}

function Sequencify(FOLDER_NAME){
  var XMLs = getFiles(FOLDER_NAME);

  for (var i = 0; i <= XMLs.length; i++) {
    var file = XMLs[i];
    
    if(file){
      if(file.indexOf('.DS_Store') === -1 && file.indexOf('.ql') === -1 && file.indexOf('Empresa.hbm.xml') === -1 && file.indexOf('.java') === -1)
        GenerateSequences(file);
    }
  } 
}

Sequencify('OLD XMLs');
