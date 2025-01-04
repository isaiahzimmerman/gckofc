import os

filePaths = []

baseDir = os.getcwd()

# baseDir = os.path.dirname(baseDir)
# baseDir = os.path.dirname(baseDir)

print(baseDir+"//assets//imagePaths.js")

f = open(baseDir+"//assets//imagePaths.js", "w")

f.write("test2")

# def writeAllImages(prefix):
#     contents = os.listdir(prefix)
#     for item in contents:
#         if("." not in item):
#             newPath = prefix+"//"+item
#             writeAllImages(newPath)
#         else:
#             suffix = item.split(".")[len(item.split("."))-1].lower()
#             if suffix in ["svg", "png", "jpg", "jpeg"]:
#                 f.write("'"+(prefix.removeprefix(baseDir+"//")+"//"+item).replace("//", "/")+"',\n")