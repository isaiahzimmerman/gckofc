import os

baseDir = os.getcwd()

filePath = os.path.join(baseDir, "assets", "imagePaths.js")

os.makedirs(os.path.dirname(filePath), exist_ok=True)

with open(filePath, "w") as f:
    f.write("test4")