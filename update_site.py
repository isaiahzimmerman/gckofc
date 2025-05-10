import os

baseDir = os.getcwd()

#gets images folder
imagesPath = os.path.join(baseDir, "assets", "images")

#writes image paths to js file
outputPath = os.path.join(baseDir, "assets", "json", "imagePaths.json")
os.makedirs(os.path.dirname(outputPath), exist_ok=True)

print(imagesPath)

with open(outputPath, "w") as f:
    f.write('{"imagePaths":[')
    contents = os.listdir(imagesPath)
    for index, item in enumerate(contents):
        suffix = item.split(".")[len(item.split("."))-1].lower()
        if suffix in ["svg", "png", "jpg", "jpeg"]:
            f.write('"'+item+'"')
        if(index+1 != len(contents)):
            f.write(',')
    f.write(']}')