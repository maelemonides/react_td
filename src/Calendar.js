import { useRef, useState } from "react";
import {
  SevenColGrid,
  Wrapper,
  HeadDays,
  DateControls,
  StyledEvent,
  SeeMore
} from "./mes_styles";
import { MOCKAPPS } from "./const";
import {
  datesAreOnSameDay,
  getDarkColor,
  getDaysInMonth,
  getMonthYear,
  nextMonth,
  prevMonth,
  range,
  sortDays
} from "./utils";

//Initialisation calendrier
export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2022, 10, 1));
  const [events, setEvents] = useState(MOCKAPPS);
  const dragDateRef = useRef();
  const dragindexRef = useRef();

//Ajout d'un event
  const addEvent = (date, event) => {
    if (!event.target.classList.contains("StyledEvent")) {
      const text = window.prompt("Event name");
      if (text) {
        date.setHours(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        setEvents((prev) => [
          ...prev,
          { date, title: text, color: getDarkColor() }
        ]);
      }
    }
  };

//Pour drag un event
  const drag = (index, e) => {
    dragindexRef.current = { index, target: e.target };
  };

  const onDragEnter = (date, e) => {
    e.preventDefault();
    dragDateRef.current = { date, target: e.target.id };
  };

  const drop = (ev) => {
    ev.preventDefault();

    setEvents((prev) =>
      prev.map((ev, index) => {
        if (index === dragindexRef.current.index) {
          ev.date = dragDateRef.current.date;
        }
        return ev;
      })
    );
  };

//Création du calendrier
  return (
    <Wrapper>
      <DateControls>
        <ion-icon
          onClick={() => prevMonth(currentDate, setCurrentDate)} //Création des boutons suivant précédent
          name="arrow-back-circle-outline"
        ></ion-icon>
        {getMonthYear(currentDate)}
        <ion-icon
          onClick={() => nextMonth(currentDate, setCurrentDate)}
          name="arrow-forward-circle-outline"
        ></ion-icon>
      </DateControls>
      <SevenColGrid> 
        {sortDays(currentDate).map((day) => ( //Création des semaines en fct du mois actuel
          <HeadDays className="nonDRAG">{day}</HeadDays>
        ))}
      </SevenColGrid>

      <SevenColGrid
        fullheight={true}
        is28Days={getDaysInMonth(currentDate) === 28} //On vérifie si on est en février
      >
        {range(getDaysInMonth(currentDate)).map((day) => (
          <div
            id={`${currentDate.getFullYear()}/${currentDate.getMonth()}/${day}`} //Création d'une id de case event
            onDragEnter={(e) => 
              onDragEnter(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                ),
                e
              )
            }
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={drop}
            onClick={(e) =>
              addEvent(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                ),
                e
              )
            }
          >
            <span
              className={`nonDRAG ${
                datesAreOnSameDay(
                  new Date(),
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  )
                )
                  ? "active"
                  : ""
              }`}
            >
              {day}
            </span>
            <EventWrapper>
              {events.map(
                (ev, index) =>
                  datesAreOnSameDay(
                    ev.date,
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    )
                  ) && (
                    <StyledEvent
                      onDragStart={(e) => drag(index, e)}
                      draggable
                      className="StyledEvent"
                      id={`${ev.color} ${ev.title}`}
                      key={ev.title}
                      bgColor={ev.color}
                    >
                      {ev.title}
                    </StyledEvent>
                  )
              )}
            </EventWrapper>
          </div>
        ))}
      </SevenColGrid>
    </Wrapper>
  );
};

const EventWrapper = ({ children }) => {
  if (children.filter((child) => child).length)
    return (
      <>
        {children}
        {children.filter((child) => child).length > 2 && (
          <SeeMore
            onClick={(e) => {
              e.stopPropagation();
              console.log("clicked p");
            }}
          >
            see more...
          </SeeMore>
        )}
      </>
    );
};
