#include <stdlib.h>

struct node {
	int data;
	struct node *next;
};

int main() {
	int a = 3;

	struct node *l1 = malloc(sizeof(struct node));
	struct node *l2 = malloc(sizeof(struct node));
	struct node *l3 = malloc(sizeof(struct node));

	l1->next = l2;
	l2->next = l3;
	l3->next = NULL;

	l1->data = 42;
	l2->data = 21;
	l3->data = 201;


	int z = 0; // Good line to break on
}
