import re
import os

LOCAL_ENV = ".env.local"
README = "README.md"
TEST_PATH = ".env.test"
START_POINT = "```"
END_POINT = "```"

def get_env_names(ENV_PATH):
  env_names = []
  try: 
    with open(ENV_PATH, 'r') as f:
      for line in f:
        line.strip()
        if not line:
          continue
        if '=' in line:
          name, _ = line.split('=', 1)
          name = name.strip()
          env_names.append(name)
        if '#' in line:
          comment = line.strip()
          env_names.append(comment)

  except FileNotFoundError:
    print(f"Error : {ENV_PATH} not found.")
    exit(1)
  return env_names
  
def write_to_readme(README_PATH, env_names):
  env_block_lines = [START_POINT]

  for name in env_names:
    env_block_lines.append(name)
  
  env_block_lines.append(END_POINT)
  env_block = "\n".join(env_block_lines)
  
  try:
    with open(README_PATH, "r") as f:
      readme_contents = f.read()
  
  except FileNotFoundError:
    print(f"Error: {README_PATH} not found.")
    exit(1)
  # Define a regex pattern to match the block between the markers.
  pattern = re.compile(
      rf'({re.escape(START_POINT)}\n)(.*?)(\n{re.escape(END_POINT)})',
      re.DOTALL
  )
  
  if pattern.search(readme_contents):
    # Replace the existing block with the new env block.
    new_env_docs = pattern.sub(env_block, readme_contents)
  else:
    # If the markers are not found, append the block to the end.
    new_env_docs = readme_contents + env_block
    # Write the updated contents back to the spec file.
  with open(README_PATH, 'w') as f:
      f.write(new_env_docs)
  print(f"Updated {README_PATH} with {len(env_names)} environment variables.")

def main():
  env_names = get_env_names(LOCAL_ENV)
  print(env_names)
  write_to_readme(README, env_names)

if __name__ == '__main__':
  main()