import os
import winshell
from win32com.client import Dispatch
import subprocess

def main():
    desktop = winshell.desktop()
    path = os.path.join(desktop, "Label Generator.lnk")
    
    target = os.path.abspath(os.path.join(os.getcwd(), 'source\\generate_file.exe'))
    wDir = os.path.abspath(os.path.join(os.getcwd(), 'source'))
    icon = target

    shell = Dispatch('WScript.Shell')

    shortcut = shell.CreateShortCut(path)
    shortcut.Targetpath = target
    shortcut.WorkingDirectory = wDir
    shortcut.IconLocation = icon
    shortcut.save()

    subprocess.check_call(["attrib","+H", wDir])

    os.rename(__file__, os.path.join(wDir, os.path.basename(__file__)))

if __name__ == '__main__':
    main()