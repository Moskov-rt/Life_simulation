import re

def extract_conflicts(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            
        conflicts = re.findall(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> aistudio/main', content, re.DOTALL)
        if conflicts:
            print(f"--- Conflicts in {filename} ({len(conflicts)}) ---")
            for i, (ours, theirs) in enumerate(conflicts):
                print(f"Conflict {i+1}:")
                print(f"OURS (Phase 1):\n{ours}")
                print(f"THEIRS (AI Studio):\n{theirs}")
                print("-" * 40)
    except Exception as e:
        print(f"Could not read {filename}: {e}")

files = [
    'src/App.tsx',
    'src/components/AppearanceModal.tsx',
    'src/components/CharacterCreator.tsx',
    'src/types.ts'
]

for f in files:
    extract_conflicts(f)
