/**
 * Low level libraries code for list
 * manipulation
 */

/*
  given L=list, find M and I, where M is maximum number in the list
  and I is the list index
*/
max_list(L, M, I) :- nth0(I, L, M), \+ (member(E, L), E > M).

/*
  increment a number in the list identified by its index by 1
*/
increment_list_at_position([H|T], 0, [H1|T]):-H1 is H+1.  % increment first element by 1 when 2nd arg = 0
increment_list_at_position([H|T], I, [H|R]):-
  I > -1,
  NI is I-1,                                              % decrement 2nd arg by 1 recursively until is 0 while passing tail of list
  increment_list_at_position(T, NI, R), !.
increment_list_at_position(L, _, _, L).

/*
  Identify the index of a element in the list
*/
indexOf([Element|_], Element, 0):- !.                     % base case 3rg arg becomes 0 when first element is Element
indexOf([_|Tail], Element, Index):-
  indexOf(Tail, Element, Index1),
  !,
  Index is Index1+1.                                      % keep incrementing Index as predicate exit recursion

/*
  Identify the length of a list
*/
list_length([], 0 ).                                      % base case length=0 when list empty
list_length([_|Xs] , L ) :- list_length(Xs,N) , L is N+1 .% increment L as predicate exit recursion
