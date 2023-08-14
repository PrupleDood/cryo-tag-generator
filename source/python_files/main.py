import zipfile
import os
from time import sleep
from webbrowser import open as web_open

parent_folder = os.path.abspath(os.path.join(os.getcwd(), os.pardir))

def generate_doc(labels: list=None, filename: str=None): 

    if not os.path.exists(f'{parent_folder}\\label_text.txt'):
        print(f'FILE NOT FOUND \n Please make sure: {parent_folder}\\label_text.txt exists')
        return

    def get_labels():

        with open(f'{parent_folder}\\label_text.txt', 'r') as file:
            lines = file.read()
            lines = lines.split('|')

        lines = labels if labels is not None else lines

        replaceText = {}

        letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
                'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

        [replaceText.setdefault(f'label{num//26+1}{letters[num % 26]}', '\n\n\n') for num in range(86)] 

        keys = tuple(replaceText.keys())

        extra_labels = None

        for i, label in enumerate(lines):
            try:
                replaceText[keys[i]] = label

            except KeyError:
                extra_labels = lines[i:]

        return replaceText, extra_labels

    replaceText, extra_labels = get_labels()

    templateDocx = zipfile.ZipFile("word/template.docx")
    newDocx = zipfile.ZipFile(f"{parent_folder}\\{filename}.docx", "w")

    with open(templateDocx.extract("word/document.xml")) as tempXmlFile:
        tempXmlStr = tempXmlFile.read()

    for key in replaceText.keys():
        tempXmlStr = tempXmlStr.replace(str(key), str(replaceText.get(key)))

    with open("temp.xml", "w+") as tempXmlFile:
        tempXmlFile.write(tempXmlStr)

    for file in templateDocx.filelist:
        if not file.filename == "word/document.xml":
            newDocx.writestr(file.filename, templateDocx.read(file))

    newDocx.write("temp.xml", "word/document.xml")

    templateDocx.close()
    newDocx.close()

    os.remove('temp.xml')
    os.remove('word/document.xml')

    print(f'Document {filename} Generated Successfully')

    if extra_labels is not None:
        generate_doc(extra_labels, f'{filename}_extra')
    
    else: 
        sleep(3)

def main():
    print(f'''
    Instructions:
          1. Add all neccesary labels to list with website
          2. Click on the "Generate Text File" button and save the file as "labels.txt" to {parent_folder}
          3. Respond with y or Y to the prompt and the file will be generated (N or n to exit) 
    ''')
    web_open(f'{os.getcwd()}/labelGenerator.html')

    while True:
        generate_prompt = input('Generate Document?')

        if generate_prompt in ('Y', 'y'):
            generate_doc(filename='labels')
            break

        elif generate_prompt in ('N', 'n'): 
            break

if __name__ == '__main__':
    main()