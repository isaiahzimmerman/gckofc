import os

baseDir = os.getcwd()

#gets images folder
imagesPath = os.path.join(baseDir, "assets", "images")

#writes image paths to js file
outputPath = os.path.join(baseDir, "assets", "imagePaths.json")
os.makedirs(os.path.dirname(outputPath), exist_ok=True)

with open(outputPath, "w") as f:
    def writeAllImages(prefix):
        contents = os.listdir(prefix)
        for item in contents:
            if("." not in item):
                newPath = prefix+"//"+item
                writeAllImages(newPath)
            else:
                suffix = item.split(".")[len(item.split("."))-1].lower()
                if suffix in ["svg", "png", "jpg", "jpeg"]:
                    f.write("'"+(prefix.removeprefix(baseDir+"//")+"//"+item).replace("//", "/")+"',\n")
    writeAllImages(imagesPath)