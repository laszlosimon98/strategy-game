import os
from PIL import Image

import tkinter as tk
from customtkinter import CTk, set_appearance_mode, set_default_color_theme, CTkButton, CTkFrame, CTkLabel
from tkinter import filedialog


IMAGE_SIZE = 64
ANIMATION_COUNT = 8

result = list()

def choose_folder():
    return filedialog.askdirectory(initialdir="./")

def generate(root_folder = "./") -> list:
    path, folders, files = next(os.walk(root_folder))

    if (files):
        obj = {
            "path": path,
            "files": files
        }
        result.append(obj)
    
    for folder in folders:
        generate(f"{path}/{folder}")


def generate_images():
    for r in result:
        words = r['path'].split('/')[4::]
        color = words[1]
        path = "/".join(words)
        image_name = words[0]+words[2]

        files = [f"animations/{path}/{file}" for file in r['files']]
        images = [Image.open(image) for image in files]
        size = (IMAGE_SIZE * ANIMATION_COUNT, IMAGE_SIZE * ANIMATION_COUNT)

        new_im = Image.new('RGBA', size)


        x_counter = 0
        y_counter = 0   
        for image in images:
            x_offset = x_counter * IMAGE_SIZE
            y_offset = y_counter * IMAGE_SIZE

            if (words[-1] != 'idle'):
                x_counter += 1
                if x_counter == ANIMATION_COUNT:
                    x_counter = 0
                    y_counter += 1
            else:
                y_counter += 1
            
            new_im.paste(image, (x_offset, y_offset))

        if not os.path.exists(f"assets/{color}"):
            os.makedirs(f"assets/{color}")

        new_im.save(f"assets/{color}/{image_name}.png")
        print(f"assets/{color}/{image_name}.png is ready")


set_appearance_mode("dark")
set_default_color_theme("green")

root = CTk()
root.geometry("400x100")
root.title("Image generator")

load_button = CTkButton(master=root, width=75, height=30, corner_radius=5, text="Load", command=lambda:generate(choose_folder()))
load_button.pack()

generate_button = CTkButton(master=root, width=75, height=30, corner_radius=5, text="Generate", command=lambda:generate_images())
generate_button.pack()

root.mainloop()
    



# def list_dir(directory: str):
#     images = os.listdir(directory)
#     result = list()

#     for image in images:
#         result.append(f"./{directory}/{image}")

#     return result

# p = "red/soldier/attacking"
# img_name = "_".join(p.split("/"))

# imgs = list_dir(f"animation/{p}")   
# images = [Image.open(x) for x in imgs]
# size = (IMAGE_SIZE * ANIMATION_COUNT, IMAGE_SIZE * ANIMATION_COUNT)

# new_im = Image.new('RGBA', size)


# x_counter = 0
# y_counter = 0
# for image in images:
#     x_offset = x_counter * IMAGE_SIZE
#     y_offset = y_counter * IMAGE_SIZE

#     x_counter += 1
#     if x_counter % ANIMATION_COUNT == 0:
#         x_counter = 0
#         y_counter += 1
    
#     new_im.paste(image, (x_offset, y_offset))

# new_im.save(f"{img_name}.png")
