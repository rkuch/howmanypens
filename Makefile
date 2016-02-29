.PHONY: all clean
OBJ=howmanypens.zip
SRC=things.json manifest.json findreplace.js icon.png \
	options.html options.js

all: $(OBJ)

$(OBJ): $(SRC)
	zip $@ $^

clean:
	rm -f $(OBJ)
